"use client"
import { useEffect, useState } from "react"
import Post from "../Card/Post";
import InfiniteScroll from 'react-infinite-scroll-component';
import Load from "./Load";
import { useLoader } from "../ui/LoaderContext";

interface props {
    userInfo: string;
    user: string
}
const HomePost = ({ userInfo, user }: props) => {
    const {ThreadFeed, setThreadFeed}: any = useLoader()
    const [Page, setPage] = useState(1)
    const [isNext, setIsNext] = useState(true)
    const [isLoad, setIsLoad] = useState(true)
    const getPosts = async () => {
        const response = await fetch(`/api/fetchpost`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ pageNumber: Page, pageSize: 8 })
        })
        const data = await response.json()
        setIsLoad(false)
        if (data.success === true) {
            setThreadFeed(ThreadFeed.concat(data.posts))
            setPage(Page + 1)
            setIsNext(data.isNext)
        }
    }
    
    useEffect(() => {
        if(ThreadFeed.length === 0){
            getPosts()
        }
    }, [])

    return (
        <InfiniteScroll
            dataLength={ThreadFeed.length}
            next={getPosts}
            hasMore={isNext}
            loader={<Load />}
            endMessage={
                <p className="text-gray-1 text-small-regular" style={{ textAlign: 'center' }}>
                    Yay! You have seen it all
                </p>
            }
            className="grid place-items-center gap-4 lg:gap-10"
        >
            {ThreadFeed.length === 0 ?
                <p className="text-gray-1 text-small-regular"> {isLoad ? "Fetching Posts" : "No Posts Found"}</p> : (
                    <>
                        {ThreadFeed?.map((post: any) => {
                            return (
                                <Post key={post._id}
                                    id={post._id}
                                    currentUserDbId={userInfo}
                                    currentUserId={user}
                                    parentId={post.parentId}
                                    content={post.text}
                                    author={post.author}
                                    community={post.community}
                                    createdAt={post.createdAt}
                                    comments={post.children}
                                    isComment={false}
                                    image={post.image}
                                    likes={post.likes}
                                />

                            )
                        })}
                    </>
                )
            }
        </InfiniteScroll>
    )
}

export default HomePost
