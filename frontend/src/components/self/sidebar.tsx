"use client";

import { Home, Search, Compass, MessageCircle, Heart, PlusSquare, User, MoreHorizontal, Film, Bot, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/redux/store';

export default function Sidebar() {  

    const username = useSelector((state: RootState) => state.auth.username);

    return (
        <div className="w-64 p-4 border-r border-zinc-800 flex flex-col">
            <div className="mb-8">
                <Image
                    src="/instagram-wordmark.svg"
                    alt="Instagram logo"
                    width={150}
                    height={150}
                />
            </div>

            <div className="space-y-2 flex-1">
                <Link href="/" className="flex items-center gap-4 p-3 hover:bg-zinc-800 rounded-lg cursor-pointer">
                        <Home size={24} />
                        <span className="text-base">Home</span>
                </Link>
                <Link href="/" className="flex items-center gap-4 p-3 hover:bg-zinc-800 rounded-lg cursor-pointer">
                    <Search size={24} />
                    <span className="text-base">Search</span>
                </Link>
                <Link href="/explore" className="flex items-center gap-4 p-3 hover:bg-zinc-800 rounded-lg cursor-pointer">
                    <Compass size={24} />
                    <span className="text-base">Explore</span>
                </Link>
                <Link href="/reels" className="flex items-center gap-4 p-3 hover:bg-zinc-800 rounded-lg cursor-pointer">
                    <Film size={24} />
                    <span className="text-base">Reels</span>
                </Link>
                <Link href="/direct/inbox" className="flex items-center gap-4 p-3 hover:bg-zinc-800 rounded-lg cursor-pointer">
                    <MessageCircle size={24} />
                    <span className="text-base">Messages</span>
                </Link>
                <Link href="/" className="flex items-center gap-4 p-3 hover:bg-zinc-800 rounded-lg cursor-pointer">
                    <Heart size={24} />
                    <span className="text-base">Notifications</span>
                </Link>
                <Link href="/" className="flex items-center gap-4 p-3 hover:bg-zinc-800 rounded-lg cursor-pointer">
                    <PlusSquare size={24} />
                    <span className="text-base">Create</span>
                </Link>
                <Link href={`/${username}`} className="flex items-center gap-4 p-3 hover:bg-zinc-800 rounded-lg cursor-pointer">
                    <User size={24} />
                    <span className="text-base">Profile</span>
                </Link>
            </div>

            <div className="space-y-2 mt-auto">
                <Link href="/meta-ai" className="flex items-center gap-4 p-3 hover:bg-zinc-800 rounded-lg cursor-pointer">
                    <Bot size={24} />
                    <span className="text-base">Meta AI</span>
                </Link>
                <Link href="/threads" className="flex items-center gap-4 p-3 hover:bg-zinc-800 rounded-lg cursor-pointer">
                    <MessageSquare size={24} />
                    <span className="text-base">Threads</span>
                </Link>
                <Link href="/more" className="flex items-center gap-4 p-3 hover:bg-zinc-800 rounded-lg cursor-pointer">
                    <MoreHorizontal size={24} />
                    <span className="text-base">More</span>
                </Link>
            </div>
        </div>
    )
}