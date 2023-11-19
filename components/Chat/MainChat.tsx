import MainChatHead from "./MainChatHead"
import MessageSender from "./MessageSender";
import ChatInbox from "./ChatInbox";

interface props{
    name: string;
    image: string;
    currentUserId: string;
    chatUserId: string;
    chatUserProfileId: string;
}

const MainChat = ({name, image, chatUserId, currentUserId, chatUserProfileId}: props) => {
  return (
    <div className="w-full gap-4 flex-col flex justify-between min-h-screen max-h-screen overflow-hidden main-chat">
        <MainChatHead name={name} image={image} chatUser={chatUserProfileId} />
        <ChatInbox currentUserId={currentUserId} chatUser={chatUserId} image={image} />
        <MessageSender userId={currentUserId} chatUser={chatUserId} />
    </div>
  )
}

export default MainChat
