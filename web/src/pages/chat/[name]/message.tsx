import { memo } from "react";
import { getAvatarColor } from "@/lib/helper";
import { IMessage } from "@/types/message";
interface IProps {
    messages: IMessage[];
    message: IMessage;
    username: string;
    index: number;
}

const MessageComponent = ({ messages, message, username, index }: IProps) => {
    const isCurrentUser = message.sender === username;
    const showAvatar = !isCurrentUser && (index === 0 || messages[index - 1].sender !== message.sender);
    return (
        <div className={`mb-2 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}  >
            {!isCurrentUser && showAvatar && (
                <div className="w-8 h-8 rounded-full mr-2 flex items-center justify-center" style={{ backgroundColor: getAvatarColor(message.sender) }}>
                    <span className="text-white">{message.sender[0]}</span>
                </div>
            )}
            {!isCurrentUser && !showAvatar && <div className="w-8 h-8 mr-2" />}
            <div className={`p-2 rounded-lg max-w-[70%] md:max-w-[40%] ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                {message.content}
            </div>
            {isCurrentUser && (
                <div className="w-8 h-8 ml-2 hidden">
                    <span className="text-white">{message.sender[0]}</span>
                </div>
            )}
        </div>
    );
}

export default memo(MessageComponent);
