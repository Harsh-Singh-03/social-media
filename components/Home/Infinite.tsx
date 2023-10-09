"use client"

import { fetchPosts } from "@/server/actions/thread.actions";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../Card/Post";

interface props {
    id: string;
}
const Infinite = ({ id }: props) => {
    const [PostData, setPostData] = useState([])
    const [documentCount, setDocumentCount] = useState(0)
    const [isNext, setIsNext] = useState(true)
    const [pageNo, setPageNo] = useState(1)
    const getPostData = async () => {
        // const postResult: any = await fetchPosts(pageNo, 5);
        // setPageNo(pageNo+1)
        // setPostData(postResult.posts)
        // setDocumentCount(postResult.totalDocumentCount)
        // setIsNext(postResult.isNext)
        const response = await fetch('/api/fetchpost', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({data: id})
        })
        // const data = await response.json()
        console.log(response)
    }
    useEffect(() => {
        getPostData()
    }, [])

    return (
        // <InfiniteScroll
        //     dataLength={documentCount}
        //     next={() => getPostData()}
        //     hasMore={isNext}
        //     loader={<h4>Loading...</h4>}
        // >
        //     {PostData.length === 0 ?
        //         <p className="text-light-1 text-small-regular">No Posts Found</p> : (
        //             <>
        //                 {PostData.map((post: any) => {
        //                     return (
        //                         <Post key={post._id}
        //                             id={post._id}
        //                             currentUserId={id}
        //                             parentId={post.parentId}
        //                             content={post.text}
        //                             author={post.author}
        //                             community={post.community}
        //                             createdAt={post.createdAt}
        //                             comments={post.children}
        //                             isComment={false}
        //                             image={post.image}
        //                         />

        //                     )
        //                 })}
        //             </>
        //         )
        //     }
        // </InfiniteScroll>
        <>
        </>
    )
}

export default Infinite
