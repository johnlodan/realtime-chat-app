import { memo, useState } from "react";
import { io as socketIo } from 'socket.io-client';

const BASE_API = process.env.BASE_API
interface IProps {
    username: string;
    roomId: string;
}

const KeyboardComponent = (props: IProps) => {
    const [content, setContent] = useState('');
    const sendMessage = () => {
        const socket = socketIo(BASE_API);
        if (content && props.username) {
            socket.emit('sendMessage', { content, sender: props.username, roomId: props.roomId });
            setContent('');
        } else {
            console.error("Content and sender must be provided.");
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') sendMessage();
        const socket = socketIo(BASE_API);
        socket.emit('typing', { sender: props.username, roomId: props.roomId }); // Emit typing event
    };

    return (
        <div className="flex">
            <input
                id="messageInput"
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message"
                className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
            />
            <button
                onClick={sendMessage}
                className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600"
            >Send
            </button>
        </div>
    )
}

export default memo(KeyboardComponent)