"use server"
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Community from "../models/community.model";

interface Params {
  text: string;
  image?: string | undefined | null
  author: string;
  communityId: string | null;
  path: string;
}
export const postThread = async ({ text, image, author, communityId, path }: Params) => {
  try {
    connectToDB()
    const ThreadData = await Thread.create({
      text,
      image,
      author,
      community: communityId || null,
    })
    await User.findByIdAndUpdate(author, {
      $push: { threads: ThreadData._id },
    });
    if (communityId) {
      await Community.findByIdAndUpdate(communityId, {
        $push: { threads: ThreadData._id }
      })
    }
    revalidatePath(path)
    return { success: true }
  } catch (error: any) {
    console.log(error)
  }
}

// TODO : To learn about everything in populate
export const fetchThread = async (id: string) => {
  try {
    connectToDB();

    const postQuery = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "community",
        model: Community,
        select: "_id name image",
      })
      .populate({
        path: "children",
        options: {
          sort: { createdAt: -1 }, // Sort children by createdAt in descending order (newest first)
        },
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return postQuery;
  } catch (error: any) {
    console.log(error);
  }
};


export const addComment = async (threadId: string, commentId: string, comment: string, userId: string, path: string, communityId: string | null) => {
  try {
    connectToDB()
    const parentThread = await Thread.findById(threadId)
    if (!parentThread) { throw new Error("Thread not found") }
    const newThread = new Thread({
      parentId: threadId,
      text: comment,
      parentCommentId: threadId !== commentId ? commentId : null,
      author: userId,
      community: communityId || null
    })
    const savedCommentThread = await newThread.save();
    if (commentId !== threadId) {
      const commentThread = await Thread.findById(commentId)
      if (!commentThread) { throw new Error("Thread not found") }
      commentThread.children.push(savedCommentThread._id);
      await commentThread.save()
    } else {
      parentThread.children.push(savedCommentThread._id);
      await parentThread.save()
    }
    revalidatePath(path)
    return { success: true }
  } catch (error: any) {
    console.log(error)
  }
}

export const deleteThread = async (threadId: string, path: string) => {
  try {
    connectToDB()
    const threadObj = await Thread.findById(threadId)
    if (!threadObj) throw new Error("Thread Not Found")
    // console.log(threadObj)
    // if thread does not have any parent id so its main thread so we have to delete it with all comments and reply and remove from user's thread and if the thread refer to comunity then have to removed from community also
    if (!threadObj.parentId && !threadObj.parentCommentId) {
      let UserData = await User.findById(threadObj.author)
      if (!UserData) throw new Error("Not Found")
      if (threadObj.community) {
        let communityData = await Community.findById(threadObj.community)
        if (communityData) {
          communityData.threads = communityData.threads.filter((thread: any) => thread.toString() !== threadId);
          await communityData.save()
        }
      }
      await Thread.deleteMany({ parentId: threadId })// to delete all the comment & reply 
      await Thread.findByIdAndDelete(threadId)
      UserData.threads = UserData.threads.filter((thread: any) => thread.toString() !== threadId);
      await User.findByIdAndUpdate(UserData._id, {threads: UserData.threads}, {new: true})
      revalidatePath(path)
      return { success: true }
    }
    if (threadObj.parentId && !threadObj.parentCommentId) {
      // if its does not have comment Id but have parent id then it is comment so in this i have to delete it with deleting all the child thread and also we have to remove it from parent children
      let parentPost = await Thread.findById(threadObj.parentId)
      if (!parentPost) throw new Error("Not found")
      if (threadObj.children && threadObj.children.length > 0) {
        await Thread.deleteMany({ parentCommentId: threadId })
      }
      parentPost.children.filter((child: any) => child !== threadId)
      await parentPost.save()
      await Thread.findByIdAndDelete(threadId)
      revalidatePath(path)
      return { success: true }
    }
    if (threadObj.parentCommentId && threadObj.parentId) {
      // if it have parentCommentId then it is a reply so i have to delete it or also have to remove it from its parent comment children
      let parentComment = await Thread.findById(threadObj.parentCommentId)
      // console.log(parentComment.children.length)
      if (parentComment && parentComment.children && parentComment.children.length > 0) {
        parentComment.children.filter((child: any) => child !== threadId)
        await parentComment.save()
        await Thread.findByIdAndDelete(threadId)
        revalidatePath(path)
        return { success: true }
      }

    }
  } catch (error: any) {
    console.log(error)

  }
}

export const editThread = async (id: string, text: string, path: string) => {
  try {
    connectToDB()
    const ThreadObj = await Thread.findById(id)
    if (!ThreadObj) throw new Error("Not found")
    await Thread.findByIdAndUpdate(id, { text: text })
    revalidatePath(path)
    return { success: true, message: "Thread Updated" }
  } catch (error: any) {
    console.log(error)
    throw new Error(`Error : ${error.message}`)
  }
}

// Likes on thread
export const addLike = async (threadId: string, userId: string, path: string) => {
  try {
    const thread = await Thread.findById(threadId)
    if (!thread) throw new Error("Thread not found")
    thread.likes.push(userId)
    await thread.save()
    revalidatePath(path)
    return { success: true }
  } catch (error: any) {
    console.log(error.message)
  }
}

export const disLike = async (threadId: string, userId: string, path: string) => {
  try {
    const thread = await Thread.findById(threadId)
    if (!thread) throw new Error("Thread not found")
    thread.likes.pull(userId)
    await thread.save()
    revalidatePath(path)
    return { success: true }
  } catch (error: any) {
    console.log(error.message)
  }
}
// Get people who liked by pagination...

export const getWhoLikes = async (threadId: string) => {
  try {
    connectToDB()
    const Likes = await Thread.findById(threadId)
      .sort({ createdAt: "desc" })
      .populate({
        path: "likes",
        model: User,
        select: "id name username image",
      })
    if (!Likes) return { success: false }
    return { success: true, Likes }

  } catch (error: any) {
    console.log(error.message)
  }
}