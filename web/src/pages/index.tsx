// pages/landing.tsx
"use client"
import Button from '@/components/button';
import { useCreateRoomMutation, useLazyCheckRoomByNameQuery } from '@/services/rooms';
import { useRouter } from 'next/router';
import { useState } from 'react';
export default function LandingPage() {
    const router = useRouter();
    const [showError, setShowError] = useState("")
    const [create, { isLoading: createLoading }] = useCreateRoomMutation();
    const [checkRoom, { isLoading: checkLoading }] = useLazyCheckRoomByNameQuery()
    const [roomId, setRoomId] = useState('');

    async function handleSubmit() {
        const response: any = await create(null);
        const { error }: any = response;
        if (!error) {
            router.push(`chat/${response?.data?.name}`);
        }
    }

    async function handleJoinRoom() {
        try {
            const response = await checkRoom(roomId);
            if (response?.data?.id) {
                console.log("Room ID valid. Redirecting to chat:", roomId);
                router.push(`/chat/${roomId}`);
                setShowError("");
            } else {
                setShowError(`Room ID: ${roomId} does not exist. Please ensure that you have typed the Room ID correctly or ask your friends for the correct Room ID`)
            }
        } catch (error) {
            console.error("Error checking room:", error);
            setShowError("An error occurred while checking the room. Please try again.");
        }
    }

    const { basePath } = useRouter();
    return (
        <div className="flex items-center justify-center h-screen bg-cover bg-center p-3" style={{ backgroundImage: `url(${basePath}/images/bg.jpg)` }}>
            <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-6 md:p-8 text-center w-full max-w-xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-gray-800 text-shadow">
                    Welcome! Enjoy chatting in real-time with friends — completely free and fun!
                </h1>
                <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4 w-full">
                    <div className="flex w-full md:w-1/2">
                        <input
                            type="text"
                            placeholder="Enter Room ID"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button
                            loading={checkLoading}
                            onClick={handleJoinRoom}
                            className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-r-lg"
                        >Join
                        </Button>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        loading={createLoading}
                        className="w-full md:w-1/2 px-6 py-3 text-lg font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600"
                    >Create Chat Room
                    </Button>
                </div>
                {showError && (
                    <div className="mt-4 text-red-700 font-semibold">
                        {showError}
                    </div>
                )}
            </div>
        </div>
    );
}
