import { fetchUserCommunity } from "@/server/actions/user.actions";
import ProfileCard from "../Card/ProfileCard";

interface props {
    accountId: string
    accountType: string
}

const MemberTab = async ({
    accountId, accountType
}: props) => {
    let result: any;
    if (accountType === 'User') {
        result = await fetchUserCommunity(accountId)
    }
    return (
        <div className="mt-6 lg:mt-10 p-4 lg:p-7 flex flex-col gap-4 lg:gap-7 bg-dark-2 rounded-lg border border-dark-4">
            {result && result.communities.length > 0 ? result.communities.map((member: any, index: number) => (
                <>
                    <ProfileCard id={member._id} name={member.name} username={member.username} imageUrl={member.image} personType="Community" />
                    {result.communities.length !== (index + 1) ? <span className="w-full h-0.5 bg-dark-4"></span> : <></>}
                </>
            )) : <p className="text-small-regular text-center text-gray-1">No communities found</p>}
        </div>
    )
}

export default MemberTab
