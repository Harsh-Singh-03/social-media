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
        const threads = await User.findOne({ id: payload.id }).populate({
            path: "threads",
            model: Thread,
            options: {
              sort: { createdAt: -1 }, // Sort by the "createdAt" field in descending order
              skip: skipAmount,
              limit: payload.pageSize
            },
            populate: [
              {
                path: "community",
                model: Community,
                select: "name image _id", // Select the "name" and "_id" fields from the "Community" model
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
    
        const totalDocumentCount = await User.findOne({ id: payload.id })

        const isNext = totalDocumentCount.threads.length > skipAmount + threads.threads.length;
        return NextResponse.json({ threads, isNext, totalDocumentCount: totalDocumentCount.threads.length, success: true })
    
      } catch (error: any) {
        console.log(error)
      }

}