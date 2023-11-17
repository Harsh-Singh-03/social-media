import MainChatHead from "./MainChatHead"
import MessageSender from "./MessageSender";
import ChatInbox from "./ChatInbox";

interface props{
    name: string;
    image: string;
    currentUserId: string;
    chatUserId: string
}

const MainChat = ({name, image, chatUserId, currentUserId}: props) => {
  return (
    <div className="w-full gap-4 flex-col flex justify-between min-h-screen max-h-screen overflow-hidden main-chat">
        <MainChatHead name={name} image={image} currentUserId={currentUserId} chatUser={chatUserId} />
        <ChatInbox currentUserId={currentUserId} chatUser={chatUserId} image={image} />
        <MessageSender userId={currentUserId} chatUser={chatUserId} />
    </div>
  )
}

export default MainChat
