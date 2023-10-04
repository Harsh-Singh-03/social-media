"use server"

import { revalidatePath } from "next/cache";
import Community from "../models/community.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model";
import { SortOrder } from "mongoose";
import { FilterQuery } from "mongoose";

interface create {
    name: string;
    username: string;
    createdBy: string;
    bio?: string;
    image?: string;
    path: string
}
// fucntion for creating a community
export const createCommunity = async ({
    name, username, createdBy, bio = "", image = "", path
}: create) => {
    try {
        connectToDB()
        const data = await Community.create({
            name,
            username,
            createdBy,
            bio: bio || "",
            image: image || ""
        })
        await User.findByIdAndUpdate(createdBy, {
            $push: { communities: data._id },
        });
        await Community.findByIdAndUpdate(data._id, {
            $push: { members: createdBy },
        });
        revalidatePath(path)
        return { success: true, message: `${name} created !!` }

    } catch (error: any) {
        console.log(error.message)
    }
}
// fucntion for join a community
export const requestForJoin = async (communityId: string, userId: string, path: string) => {
    try {
        connectToDB()
        const community = await Community.findById(communityId)
        if (!community) throw new Error("not found")
        await User.findByIdAndUpdate(userId, {
            $push: { communities: community._id },
        });
        await Community.findByIdAndUpdate(communityId, {
            $push: { members: userId },
        });
        revalidatePath(path)
        return { success: true, message: `Welcome in ${community.name}` }
    } catch (error: any) {
        console.log(error.message)
    }
}
// Remove a member by admin
export const removeMember = async (adminId: string, userId: string, communityId: string, type: string, path: string) => {
    try {
        connectToDB()
        const community = await Community.findById(communityId)
        const user = await User.findById(userId)
        
        if (type === "kick") {
            if (!community || community.createdBy.toString() !== adminId.toString() || !user) throw new Error("not found")
        } else {
            if (!community || !user) throw new Error("not found")
        }
        // Remove the user from the community
        await Community.findByIdAndUpdate(communityId, {
            $pull: { members: userId },
        });

        // Remove the community from the user
        await User.findByIdAndUpdate(userId, {
            $pull: { communities: communityId },
        });
        revalidatePath(path)
        return { success: true, message: `${user.name} removed from the ${community.name}` }

    } catch (error: any) {
        console.log(error.message)

    }
}

export const getCommunity = async (id: string, userId: string) => {
    try {
        connectToDB()
        let fucnButton = "Join"
        const Data = await Community.findById(id)
            .populate({
                path: "members", // Specify the path to populate
                model: User,
                select: "name _id id image username", // Select the fields you want from the Community model
            }).exec()
        if (!Data) throw new Error("Not Found")
        const isMember = Data.members.some((member: any) => member._id.equals(userId));
        if (Data.createdBy.toString() === userId.toString() && isMember) {
            fucnButton = "Delete"
        } else if (isMember) {
            fucnButton = "Leave"
        }
        return { Data, fucnButton }
    } catch (error: any) {
        console.log(error.message)
    }
}

export const fetchCommnityPost = async (id: string) => {
    try {
        connectToDB()
        const threads = await Community.findById(id).populate({
            path: "threads",
            model: Thread,
            options: {
                sort: { createdAt: -1 } // Sort by the "createdAt" field in descending order
            },
            populate: [
                {
                    path: "author",
                    model: User,
                    select: "name image id", // Select the "name" and "_id" fields from the "User" model
                },
                {
                    path: "children",
                    model: Thread,
                    populate: {
                        path: "author",
                        model: User,
                        select: "name image id", // Select the "name" and "_id" fields from the "User" model
                    },
                },
            ],
        });
        return threads;

    } catch (error: any) {
        console.log(error)

    }
}

export async function fetchCommunities({
    searchString = "",
    pageNumber = 1,
    pageSize = 10,
    sortBy = "desc",
  }: {
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
  }) {
    try {
      connectToDB();
  
      // Calculate the number of communities to skip based on the page number and page size.
      const skipAmount = (pageNumber - 1) * pageSize;
  
      // Create a case-insensitive regular expression for the provided search string.
      const regex = new RegExp(searchString, "i");
  
      // Create an initial query object to filter communities.
      const query: FilterQuery<typeof Community> = {};
  
      // If the search string is not empty, add the $or operator to match either username or name fields.
      if (searchString.trim() !== "") {
        query.$or = [
          { username: { $regex: regex } },
          { name: { $regex: regex } },
        ];
      }
  
      // Define the sort options for the fetched communities based on createdAt field and provided sort order.
      const sortOptions = { createdAt: sortBy };
  
      // Create a query to fetch the communities based on the search and sort criteria.
      const communitiesQuery = Community.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize)
        .populate("members");
  
      // Count the total number of communities that match the search criteria (without pagination).
      const totalCommunitiesCount = await Community.countDocuments(query);
  
      const communities = await communitiesQuery.exec();
  
      // Check if there are more communities beyond the current page.
      const isNext = totalCommunitiesCount > skipAmount + communities.length;
  
      return { communities, isNext };
    } catch (error) {
      console.error("Error fetching communities:", error);
      throw error;
    }
  }

// 