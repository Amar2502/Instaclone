"use client";

import { Search, Compass, MessageCircle, Heart, PlusSquare, User, MoreHorizontal, Film, Bot, MessageSquare, X, House } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/app/redux/store';
import { setActiveTab } from '@/app/redux/slices/sidebarslice';
import SearchAccounts from "./searchaccounts";

export default function Sidebar() {

    const username = useSelector((state: RootState) => state.auth.username);
    const activeTab = useSelector((state: RootState) => state.sidebar.activeTab);
    const dispatch = useDispatch();

    const handleTabClick = (tab: string) => {
        dispatch(setActiveTab({ activeTab: tab }));
    }

    // Tabs that should collapse the sidebar
    const collapsibleTabs = ['search', 'notifications'];
    const isCollapsed = collapsibleTabs.includes(activeTab?.toLowerCase());

    return (
        <div className="flex h-screen">
            {/* Main Sidebar */}
            <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-black border-r border-zinc-800 flex flex-col transition-all duration-300 ease-in-out`}>
                {/* Logo */}
                <div className={`${isCollapsed ? 'p-6' : 'p-6'} mb-2`}>
                    {isCollapsed ? (
                        <div className="flex justify-center">
                            <Image
                                src="/instalogo.png"
                                alt="Instagram logo"
                                width={24}
                                height={24}
                                className="object-contain"
                            />
                        </div>
                    ) : (
                        <Image
                            src="/instagram-wordmark.svg"
                            alt="Instagram logo"
                            width={150}
                            height={40}
                            className="object-contain"
                        />
                    )}
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-3">
                    <div className="space-y-1">
                        <Link
                            href="/"
                            className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'px-3'} py-3 rounded-lg hover:bg-zinc-900 transition-colors ${activeTab === 'home' ? 'font-bold' : ''}`}
                            onClick={() => handleTabClick('home')}
                        >
                            <House size={24} className={activeTab === 'home' ? 'fill-white' : ''} />
                            {!isCollapsed && <span className={`ml-4 text-base ${activeTab === 'home' ? 'font-bold' : ''}`}>Home</span>}
                        </Link>

                        <div
                            className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'px-3'} py-3 rounded-lg hover:bg-zinc-900 transition-colors ${activeTab === 'search' ? 'font-bold' : ''}`}
                            onClick={() => handleTabClick('search')}
                        >
                            <Search size={24} className={activeTab === 'search' ? 'fill-white' : ''} />
                            {!isCollapsed && <span className={`ml-4 text-base ${activeTab === 'search' ? 'font-bold' : ''}`}>Search</span>}
                        </div>

                        <Link
                            href="/explore"
                            className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'px-3'} py-3 rounded-lg hover:bg-zinc-900 transition-colors ${activeTab === 'explore' ? 'font-bold' : ''}`}
                            onClick={() => handleTabClick('explore')}
                        >
                            <Compass size={24} className={activeTab === 'explore' ? 'fill-white' : ''} />
                            {!isCollapsed && <span className={`ml-4 text-base ${activeTab === 'explore' ? 'font-bold' : ''}`}>Explore</span>}
                        </Link>

                        <Link
                            href="/reels"
                            className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'px-3'} py-3 rounded-lg hover:bg-zinc-900 transition-colors ${activeTab === 'reels' ? 'font-bold' : ''}`}
                            onClick={() => handleTabClick('reels')}
                        >
                            <Film size={24} className={activeTab === 'reels' ? 'fill-white' : ''} />
                            {!isCollapsed && <span className={`ml-4 text-base ${activeTab === 'reels' ? 'font-bold' : ''}`}>Reels</span>}
                        </Link>

                        <Link
                            href="/direct/inbox"
                            className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'px-3'} py-3 rounded-lg hover:bg-zinc-900 transition-colors ${activeTab === 'messages' ? 'font-bold' : ''}`}
                            onClick={() => handleTabClick('messages')}
                        >
                            <MessageCircle size={24} className={activeTab === 'messages' ? 'fill-white' : ''} />
                            {!isCollapsed && <span className={`ml-4 text-base ${activeTab === 'messages' ? 'font-bold' : ''}`}>Messages</span>}
                        </Link>

                        <div
                            className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'px-3'} py-3 rounded-lg hover:bg-zinc-900 transition-colors ${activeTab === 'notifications' ? 'font-bold' : ''}`}
                            onClick={() => handleTabClick('notifications')}
                        >
                            <Heart size={24} className={activeTab === 'notifications' ? 'fill-white' : ''} />
                            {!isCollapsed && <span className={`ml-4 text-base ${activeTab === 'notifications' ? 'font-bold' : ''}`}>Notifications</span>}
                        </div>

                        <Link
                            href="/create"
                            className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'px-3'} py-3 rounded-lg hover:bg-zinc-900 transition-colors ${activeTab === 'create' ? 'font-bold' : ''}`}
                            onClick={() => handleTabClick('create')}
                        >
                            <PlusSquare size={24} className={activeTab === 'create' ? 'fill-white' : ''} />
                            {!isCollapsed && <span className={`ml-4 text-base ${activeTab === 'create' ? 'font-bold' : ''}`}>Create</span>}
                        </Link>

                        <Link
                            href={`/${username}`}
                            className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'px-3'} py-3 rounded-lg hover:bg-zinc-900 transition-colors ${activeTab === 'profile' ? 'font-bold' : ''}`}
                            onClick={() => handleTabClick('profile')}
                        >
                            <User size={24} className={activeTab === 'profile' ? 'fill-white' : ''} />
                            {!isCollapsed && <span className={`ml-4 text-base ${activeTab === 'profile' ? 'font-bold' : ''}`}>Profile</span>}
                        </Link>
                    </div>
                </nav>

                {/* Bottom Navigation */}
                <div className="p-3 mt-auto">
                    <div className="space-y-1">
                        <Link
                            href="/threads"
                            className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'px-3'} py-3 rounded-lg hover:bg-zinc-900 transition-colors ${activeTab === 'threads' ? 'font-bold' : ''}`}
                            onClick={() => handleTabClick('threads')}
                        >
                            <MessageSquare size={24} className={activeTab === 'threads' ? 'font-extrabold' : ''} />
                            {!isCollapsed && <span className={`ml-4 text-base ${activeTab === 'threads' ? 'font-bold' : ''}`}>Threads</span>}
                        </Link>

                        <Link
                            href="/more"
                            className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'px-3'} py-3 rounded-lg hover:bg-zinc-900 transition-colors ${activeTab === 'more' ? 'font-bold' : ''}`}
                            onClick={() => handleTabClick('more')}
                        >
                            <MoreHorizontal size={24} className={activeTab === 'more' ? 'font-extrabold' : ''} />
                            {!isCollapsed && <span className={`ml-4 text-base ${activeTab === 'more' ? 'font-bold' : ''}`}>More</span>}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Search Panel */}
            {activeTab === 'search' && <SearchAccounts />}

            {/* Notifications Panel */}
            {activeTab === 'notifications' && (
                <div className="w-96 bg-black border-r border-zinc-800 flex flex-col">
                    <div className="p-6 pb-4">
                        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
                    </div>

                    <div className="flex-1 px-6">
                        <div className="flex justify-center items-center py-16">
                            <p className="text-zinc-500 text-sm">No notifications yet.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}