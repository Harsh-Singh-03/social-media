import Community from "@/server/models/community.model"
import Thread from "@/server/models/thread.model"
import User from "@/server/models/user.model"
import { connectToDB } from "@/server/mongoose"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        connectToDB()
        const payload = await request.json()
        const skipAmount = (payload.pageNumber - 1) * payload.pageSize
    
        const postQuery = await Thread.find({ parentId: { $in: [null, undefined] } })
          .sort({ createdAt: "desc" })
          .skip(skipAmount)
          .limit(payload.pageSize)
          .populate({
            path: "author",
            model: User,
          })
          .populate({
            path: "community",
            model: Community,
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
    
        const totalDocumentCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } })
        const isNext = totalDocumentCount > skipAmount + postQuery.length;
        return NextResponse.json({ posts: postQuery, isNext, totalDocumentCount, success: true })
    
      } catch (error: any) {
        console.log(error)
      }

}