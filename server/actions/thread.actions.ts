"use server"
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";

interface Params {
    text: string;
    author: string;
    communityId: string | null;
    path: string;
}
export const postThread = async({text, author, communityId, path}: Params) =>{
    try {
        connectToDB()
        const ThreadData = await Thread.create({
            text,
            author,
            community : communityId || null,
        }) 
        await User.findByIdAndUpdate(author, {
            $push: { threads: ThreadData._id },
        });
        revalidatePath(path)
    } catch (error: any) {
        console.log(error)
    }
}

export const fetchPosts = async(pageNumber = 1, pageSize = 10) =>{
    try {
        connectToDB()
        const skipAmount = (pageNumber - 1) * pageSize

        const postQuery = await Thread.find({ parentId: { $in: [null, undefined] } })
        .sort({ createdAt: "desc" })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({
            path: "author",
            model: User,
          })
          .populate({
            path: "children", // Populate the children field
            populate: {
              path: "author", // Populate the author field within children
              model: User,
              select: "_id name parentId image",
               // Select only _id and username fields of the author
            },
          }).exec()
        //   .populate({
        //     path: "community",
        //     model: Community,
        //   })
        
        const totalDocumentCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } })
        const isNext = totalDocumentCount > skipAmount + postQuery.length;
        return {posts: postQuery, isNext}
        
    } catch (error: any) {
        console.log(error)
    }
}
// TODO : To learn about everything in populate
export const fetchThread = async(id: string) =>{
    try {
        connectToDB()

        const postQuery = await Thread.findById(id)
        .populate({
            path: "author",
            model: User,
            select: "_id id name image",
          }) 
          .populate({
            path: "children", // Populate the children field
            populate:  [
                {
                  path: "author", // Populate the author field within children
                  model: User,
                  select: "_id id name parentId image", // Select only _id and username fields of the author
                },
                {
                  path: "children", // Populate the children field within children
                  model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
                  populate: {
                    path: "author", // Populate the author field within nested children
                    model: User,
                    select: "_id id name parentId image", // Select only _id and username fields of the author
                  },
                },
              ],
          }).exec()
        //   .populate({
        //     path: "community",
        //     model: Community,
        //   })
        return postQuery;
        
    } catch (error: any) {
        console.log(error)
    }
}

export const addComment = async (threadId: string,commentId: string, comment: string, userId: string, path: string) =>{
    try {
        connectToDB()
        const parentThread = await Thread.findById(threadId)
        if(!parentThread) {throw new Error("Thread not found")}
        const newThread = new Thread({
            parentId: threadId,
            text: comment,
            parentCommentId: threadId !== commentId ? commentId : null,
            author: userId
        })
        const savedCommentThread = await newThread.save();
        if(commentId !== threadId){
            const commentThread = await Thread.findById(commentId)
            if(!commentThread) {throw new Error("Thread not found")}
            commentThread.children.push(savedCommentThread._id);
            await commentThread.save()
        }else{
            parentThread.children.push(savedCommentThread._id);
            await parentThread.save()
        }
        revalidatePath(path)
        return {success: true}
    } catch (error: any) {
        console.log(error)
    }
}

export const deleteThread = async (threadId : string, path: string) =>{
    try {
        connectToDB()
        const threadObj  = await Thread.findById(threadId)
        if(!threadObj)  throw new Error("Thread Not Found")
        // console.log(threadObj)
        // if thread does not have any parent id so its main thread so we have to delete it with all comments and reply and remove from user's
        if(!threadObj.parentId && !threadObj.parentCommentId){
            console.log(threadObj)
            let UserData = await User.findById(threadObj.author)
            if(!UserData) throw new Error("Not Found")
            console.log(UserData.threads)
            // await Thread.deleteMany({parentId: threadId})
            await Thread.findByIdAndDelete(threadId)
            UserData.threads = UserData.threads.filter((thread: any) => thread.toString() !==  threadId);
            await UserData.save()
            revalidatePath(path)
            return {success: true}
        }
        if(threadObj.parentId && !threadObj.parentCommentId){
            // if its does not have comment Id but have parent id then it is comment so in this i have to delete it with deleting all the child thread and also we have to remove it from parent
            let parentPost = await Thread.findById(threadObj.parentId)
            if(!parentPost) throw new Error("Not found")
            if(threadObj.children && threadObj.children.length > 0){
                await Thread.deleteMany({parentCommentId: threadId})
            }
            parentPost.children.filter((child: any) => child !==  threadId)
            await parentPost.save()
            await Thread.findByIdAndDelete(threadId)
            revalidatePath(path)
            return {success: true}
        }
        if(threadObj.parentCommentId && threadObj.parentId){
            // if it have parentCommentId then it is a reply so i have to delete it or also have to remove it from its parent comment children
            let parentComment = await Thread.findById(threadObj.parentCommentId)
            // console.log(parentComment.children.length)
            if(parentComment && parentComment.children && parentComment.children.length > 0){
                parentComment.children.filter((child: any) => child !==  threadId)
                await parentComment.save()
                await Thread.findByIdAndDelete(threadId)
                revalidatePath(path)
                return {success: true}
            }       
        
        }
    } catch (error: any) {
        console.log(error)
        
    }
}
export const editThread = async (id: string, text: string, path: string) =>{
    try {
        connectToDB()
        const ThreadObj = await Thread.findById(id)
        if(!ThreadObj) throw new Error("Not found")
        await Thread.findByIdAndUpdate(id, {text: text})
        revalidatePath(path)
        return {success: true, message: "Thread Updated"}
    } catch (error: any) {
        console.log(error) 
        throw new Error(`Error : ${error.message}`)
    }
}