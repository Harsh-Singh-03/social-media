import User from "@/server/models/user.model"
import { connectToDB } from "@/server/mongoose"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        await connectToDB()
        const payload = await request.json()
        const chatList = await User.findOne({ id: payload.id })
        // let sortedArr = chatList.chatUsers.sort((a: any, b: any) => a.timeStamp - b.timeStamp)
        let sortedArr
        if(chatList.chatUsers.length > 1){
           sortedArr = chatList.chatUsers.sort((a: any, b: any) => {
            const timeStampA = new Date(a.timeStamp).getTime();
            const timeStampB = new Date(b.timeStamp).getTime();
            return timeStampB - timeStampA;
          });
        }else{
          sortedArr = chatList.chatUsers || []
        }
        // console.log(sortedArr)
        return NextResponse.json({success: true, chatList: sortedArr}) 
      } catch (error: any) {
        console.log(error)
        NextResponse.json({success: false})
      }

}