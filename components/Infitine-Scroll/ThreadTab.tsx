"use client"
import Post from "../Card/Post"
import { useEffect, useState } from "react"
import InfiniteScroll from 'react-infinite-scroll-component';
import Load from "./Load";
import { useLoader } from "../ui/LoaderContext";

interface props {
    currentUserId: string
    accountId: string
    dbId: string
}
const ThreadTab = ({
    currentUserId, accountId, dbId
}: props) => {
    
    const { UserFeed, setUserFeed }: any = useLoader()
    const [isLoad, setIsLoad] = useState(true)

    const getPosts = async () => {
        const response = await fetch(`/api/user-posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ pageNumber: UserFeed.Page, pageSize: 8, id: accountId })
        })
        const data = await response.json()
        setIsLoad(false)
        // console.log(data)
        if (data.success === true) {
            setUserFeed({
                Data: UserFeed.Data.concat(data.threads.threads),
                isNext: data.isNext,
                Page: UserFeed.Page + 1,
                name: data.threads.name,
                image: data.threads.image,
                id: data.threads.id 
            });
            // : data.threads._id,
        }
    }

    useEffect(() => {
        
        if (UserFeed.Data.length === 0 ) {
            getPosts()
        }

    }, [])

    return (
        <InfiniteScroll
            dataLength={UserFeed.Data.length}
            next={() => getPosts()}
            hasMore={UserFeed.isNext}
            loader={<Load />}
            endMessage={
                <p className="text-gray-1 text-small-regular" style={{ textAlign: 'center' }}>
                    Yay! You have seen it all
                </p>
            }
            className="flex flex-col gap-4 lg:gap-10 mt-6 lg:mt-10"
        >
            {UserFeed.Data && UserFeed.Data.length > 0 ? UserFeed.Data.map((thread: any) => (
                <Post
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    currentUserDbId={dbId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={{ name: UserFeed.name, image: UserFeed.image, id: UserFeed.id }}
                    community={
                        thread.community
                    }
                    createdAt={thread.createdAt}
                    comments={thread.children}
                    image={thread.image}
                    likes={thread.likes}
                    isComment={false}
                />
            )) : <p className="text-small-regular text-center text-gray-1">{isLoad ? "Fetching Posts" : "No Posts Found"}</p>}
        </InfiniteScroll>
    )
}

export default ThreadTab
