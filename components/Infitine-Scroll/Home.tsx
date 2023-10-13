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
    const [isLoad, setIsLoad] = useState(true)

    const getPosts = async () => {
        const response = await fetch(`/api/fetchpost`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ pageNumber: ThreadFeed.Page, pageSize: 8 })
        })
        const data = await response.json()
        setIsLoad(false)
        if (data.success === true) {
            setThreadFeed({
                Data: ThreadFeed.Data.concat(data.posts),
                isNext: data.isNext,
                Page: ThreadFeed.Page + 1,
            });
        }
    }
    
    useEffect(() => {
        if(ThreadFeed.Data.length === 0){
            getPosts()
        }
    }, [])

    return (
        <InfiniteScroll
            dataLength={ThreadFeed.Data.length}
            next={getPosts}
            hasMore={ThreadFeed.isNext}
            loader={<Load />}
            endMessage={
                <p className="text-gray-1 text-small-regular" style={{ textAlign: 'center' }}>
                    Yay! You have seen it all
                </p>
            }
            className="grid place-items-center gap-4 lg:gap-10"
        >
            {ThreadFeed.Data.length === 0 ?
                <p className="text-gray-1 text-small-regular"> {isLoad ? "Fetching Posts" : "No Posts Found"}</p> : (
                    <>
                        {ThreadFeed.Data.map((post: any) => {
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
