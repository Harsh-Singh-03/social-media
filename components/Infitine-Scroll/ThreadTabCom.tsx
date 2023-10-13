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
const ThreadTabCom = ({
    currentUserId, accountId, dbId
}: props) => {

    const { CommunityFeed, setCommunityFeed }: any = useLoader()
    const [isLoad, setIsLoad] = useState(true)

    const getPosts = async () => {
        const response = await fetch(`/api/community-posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ pageNumber: CommunityFeed.Page, pageSize: 8, id: accountId })
        })
        const data = await response.json()
        setIsLoad(false)
        // console.log(data)
        if (data.success === true) {
            setCommunityFeed({
                Data: CommunityFeed.Data.concat(data.threads.threads),
                isNext: data.isNext,
                Page: CommunityFeed.Page + 1,
                name: data.threads.name,
                image: data.threads.image,
                id: data.threads._id
            });
            // : data.threads._id,
        }
    }

    useEffect(() => {
        if (CommunityFeed.Data.length === 0) {
            getPosts()
        }

    }, [])

    return (
        <InfiniteScroll
            dataLength={CommunityFeed.Data.length}
            next={() => getPosts()}
            hasMore={CommunityFeed.isNext}
            loader={<Load />}
            endMessage={
                <p className="text-gray-1 text-small-regular" style={{ textAlign: 'center' }}>
                    Yay! You have seen it all
                </p>
            }
            className="flex flex-col gap-4 lg:gap-10 mt-6 lg:mt-10"
        >
            {CommunityFeed.Data && CommunityFeed.Data.length > 0 ? CommunityFeed.Data.map((thread: any) => (
                <Post
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    currentUserDbId={dbId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={{
                        name: thread.author.name,
                        image: thread.author.image,
                        id: thread.author.id,
                    }}
                    community={
                        { name: CommunityFeed.name, _id: CommunityFeed.id, image: CommunityFeed.image }
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

export default ThreadTabCom
