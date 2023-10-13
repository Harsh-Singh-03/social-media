"use server"

import { FilterQuery, SortOrder } from "mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import { revalidatePath } from "next/cache";
import Community from "../models/community.model";

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
  }

export const updateUser = async ({
    userId,
    bio,
    name,
    path,
    username,
    image,
  }: Params)=> {
    try {
        connectToDB()
        await User.findOneAndUpdate({id: userId},{
            username: username.toLowerCase(),
            name,
            bio,
            image,
            onboarded: true,
          }, {upsert: true})
        if(path === `/profile/edit/${userId}`){
          revalidatePath(path)
        }
        return {success: true}
    } catch (error) {
        console.log(error)
    }
}
interface syncUser{
  id: string,
  username: string | null,
  image: string | null,  
  path: string
}
export const updateUserBySync = async ({id, username, image,  path }: syncUser)=>{
  try {
    connectToDB()
    await User.findOneAndUpdate({id: id},{
      username: username?.toLowerCase(),
      image: image,
      onboarded: true
    })
    revalidatePath(path)
  } catch (error: any) {
    console.log(error)
  }
}

export const fetchUser = async (id : string): Promise<any>=> {
    try {
        connectToDB()
        const user = await User.findOne({id})
        if(user && user.onboarded === true){
          return user
        }else{
          return undefined
        }
        
    } catch (error) {
        console.log(error)
    }

}

export const fetchUserCommunity = async (id: string) =>{
  try {
    connectToDB()
    let communities = await User.findOne({ id: id })
    .populate({
      path: "communities", // Specify the path to populate
      model: Community,
      select: "name image _id username",
    }).exec()
    return communities;
    
  } catch (error: any) {
    console.log(error)
    
  }
}

export const fetchUsers = async ({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) =>{
  try {
    connectToDB()
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i"); // for case insensitive
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }
    const sortOptions = { createdAt: sortBy };
    const usersQuery = User.find(query)
    .sort(sortOptions)
    .skip(skipAmount)
    .limit(pageSize);
    const userCount = await User.countDocuments(query)
    const  users = await usersQuery.exec()
    const isNext = userCount > skipAmount + users.length;
    
    return {users, isNext};
    
  } catch (error: any) {
    console.log(error.message)
    
  }
}

export const getActivity = async (userId: string) =>{
  try {
    connectToDB()
    // Stretagy : First have to get all the thread from the user..
    const Threads = await Thread.find({author: userId})
    // TO get all the comments and reply
    const childThreadIds: any = Threads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }, // Exclude threads authored by the same user
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    }).sort({ createdAt: "desc" })
    return replies
  } catch (error: any) {
    console.log(error)
  }
}