"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from '@/app/redux/store';
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface Users {
    user_id: number;
    username: string;
    profile_picture: string;
    fullname: string;
}

interface ChatProps {
    user_id: string;
}

export default function Chat({ user_id }: ChatProps) {

    const [users, setUsers] = useState<Users[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchBar, setSearchBar] = useState(false);
    const author_id = useSelector((state: RootState) => state.auth.user_id);
    const username = useSelector((state: RootState) => state.auth.username);
    const [user, setUser] = useState<Users | null>(null);

    console.log(user_id);

    const fetchConnectedUsers = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8080/users/connected-to-users/${author_id}`
            );
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to load followers:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserById = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8080/users/get-user-by-id/${user_id}`
            );
            setUser(res.data);
        } catch (err) {
            console.error("Failed to load followers:", err);
        } finally {
            setLoading(false);
        }
    };

    const searchbarclicked = () => {
        setSearchBar(true);
        if (users.length > 0) {
            return;
        }
        setLoading(true);
        fetchConnectedUsers();
    }

    console.log(user);

    useEffect(() => {
        fetchUserById();
    }, []);

    return (
        <div className="flex h-screen bg-black text-white">
            {/* Sidebar */}
            <div className="w-[300px] border-r border-zinc-800 flex flex-col">
                <div className="p-4 flex items-center justify-between">
                    <span className="text-lg font-bold">{username}</span>
                    <Button variant="ghost" size="icon">
                        <svg
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
                        </svg>
                    </Button>
                </div>

                <div className="px-2 pb-2"> 
                    {searchBar ? (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => setSearchBar(false)}><ChevronLeft /></Button>
                            <Input placeholder="Search" className="bg-zinc-900 text-white" onClick={searchbarclicked} />
                        </div>
                    ) : (
                        <Input placeholder="Search" className="bg-zinc-900 text-white" onClick={searchbarclicked} />
                    )}
                    {users.length > 0 && searchBar && (

                        <div className="mt-2 space-y-2 overflow-y-auto">
                            {users.map((user) => (
                                <Link href={`/direct/t/${user.user_id}`} className="w-full flex items-center gap-3" key={user.user_id}>
                                    <div key={user.user_id} className="w-full flex items-center gap-3 p- hover:bg-zinc-700 cursor-pointer">
                                        <img
                                            src={user.profile_picture}
                                            alt={user.username}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div>
                                            <div className="text-sm font-medium">{user.fullname}</div>
                                            <div className="text-xs text-muted-foreground">@{user.username}</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                    )}
                </div>

                <div className="px-4 text-xs text-muted-foreground mt-4">Messages</div>
                <div className="px-4 text-xs text-blue-500">No messages found.</div>
            </div>

            {/* Message Area */}
            <div className="flex-1 flex flex-col items-center justify-center text-white relative">
                {/* Center Profile Section */}
                <div className="flex flex-col items-center space-y-2 absolute top-1/4">
                    <img
                        src={user?.profile_picture}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <div className="text-xl font-semibold">{user?.fullname}</div>
                    <div className="text-sm text-gray-400">{user?.username} · Instagram</div>
                    <Link href={`/${user?.username}`} className="bg-[#353535] px-4 py-1 rounded-md mt-2 hover:bg-[#444]">
                        View profile
                    </Link>
                </div>

                {/* Timestamp */}
                <div className="absolute bottom-24 text-xs text-gray-500">9:10 PM</div>

                {/* Messages */}
                <div className="absolute bottom-36 w-full px-6 space-y-2">
                    {/* Left-aligned messages */}
                    <div className="flex items-start space-x-2">
                        <img
                            src={user?.profile_picture}
                            className="w-6 h-6 rounded-full object-cover"
                            alt="User"
                        />
                        <div className="space-y-1">
                            <div className="bg-[#3a3a3a] px-3 py-1 rounded-full text-sm">Hi</div>
                            <div className="bg-[#3a3a3a] px-3 py-1 rounded-full text-sm">Ho</div>
                        </div>
                    </div>

                    {/* Right-aligned message */}
                    <div className="flex justify-end">
                        <div className="bg-blue-600 px-3 py-1 rounded-full text-sm">hello</div>
                    </div>
                </div>

                {/* Message input */}
                <div className="absolute bottom-0 w-full border-t border-gray-700 px-6 py-4 flex items-center space-x-2 bg-black">
                    <input
                        type="text"
                        placeholder="Message..."
                        className="flex-1 bg-transparent text-white outline-none"
                    />
                    <button className="text-white text-lg">😊</button>
                </div>
            </div>

        </div>
    );
}
