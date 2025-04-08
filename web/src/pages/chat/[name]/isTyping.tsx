import { memo } from "react";
interface IProps {
    typingUsers: string[];
}

const IsTypingComponent = ({ typingUsers }: IProps) => {
    return typingUsers.length > 0 && (
        <div className="flex items-center gap-2 text-white text-1xl italic font-bold text-shadow" aria-live="polite">
            <span>{typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...</span>
            <span className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-white typing-dot"></span>
                <span className="w-2 h-2 rounded-full bg-white typing-dot"></span>
                <span className="w-2 h-2 rounded-full bg-white typing-dot"></span>
            </span>
        </div>
    );
}

export default memo(IsTypingComponent);
