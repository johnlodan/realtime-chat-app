"use client"
import { useEffect, useState, useRef } from 'react';
import { io as socketIo } from 'socket.io-client';
import { IMessage } from '../../../types/message';
import { useRouter } from 'next/router'
import { useGetRoomByNameQuery } from '@/services/rooms';
import { generateRandomName } from '@/lib/helper';
import KeyboardComponent from './keyboard';
import IsTypingComponent from './isTyping';
import MessageComponent from './message'

const BASE_API = process.env.BASE_API

export default function Main() {
  const router = useRouter();
  const name = router.query.name;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [username, setUsername] = useState<string>('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const { data: roomData } = useGetRoomByNameQuery(name);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      const newUsername = generateRandomName();
      localStorage.setItem('username', newUsername);
      setUsername(newUsername);
    } else {
      setUsername(storedUsername);
    }
  }, []);

  const handleUserTyping = (users: string[]) => {
    const filteredUsers = users.filter((user) => user !== username);
    setTypingUsers(filteredUsers);
  };

  useEffect(() => {
    const socket = socketIo(BASE_API);
    if (roomData) {
      // Emit the join room event and handle related logic in the callback
      socket.emit('joinRoom', roomData?.id, (response: any) => {
        // Only execute this after the server confirms the user has joined the room
        if (response.success) {
          // Fetch messages specific to this room
          socket.emit('getMessages', { roomId: roomData?.id });

          // Set up listeners for room-specific events
          socket.on(`loadMessages`, (messages: IMessage[]) => {
            setMessages(messages);
            scrollToBottom();
          });

          socket.on(`newMessage`, (message: IMessage) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            scrollToBottom();
          });

          socket.on(`userTyping`, handleUserTyping);
        }
      });
    }

    return () => {
      socket.off(`loadMessages`);
      socket.off(`newMessage`);
      socket.off(`userTyping`);
      socket.disconnect();
    };
  }, [roomData]);

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 bg-cover bg-center p-4" style={{ backgroundImage: 'url(/images/chat-bg.jpg)' }}>
      <h1 className="text-3xl font-bold mb-4 text-center text-white drop-shadow text-shadow">
        CHATROOM: {name}
      </h1>
      <div className="flex-1 overflow-y-auto  bg-opacity-80 rounded-lg  p-4 mb-4">
        <div className="flex flex-col">
          {messages.map((message, index) => {
            return (<div key={`${message.id}.${index}`}>
              <MessageComponent message={message} messages={messages} index={index} username={username} />
            </div>)
          })}
          <IsTypingComponent typingUsers={typingUsers} />
          <div ref={messageEndRef} style={{ margin: 50 }} />
        </div>
      </div>
      <KeyboardComponent roomId={roomData?.id} username={username} />
    </div>
  );
}
