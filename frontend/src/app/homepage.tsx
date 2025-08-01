import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from '@/app/redux/store';
import { getTimeAgo } from "@/lib/getFormattedDate";
import { MessageCircle, MoreHorizontal, Send, Bookmark } from "lucide-react";
import { Heart } from "lucide-react";
import LoadingHomepage from "@/components/self/loadinghomepage";

interface User {
    user_id: number;
    username: string;
    profile_picture: string;
    fullname: string;
}

interface Content {
    content_id: number;
    media: string;
    content_type: string;
    caption: string;
    created_at: string;
    likes: number;
    comments: number;
    user_id: number;
    username: string;
    profile_picture: string;
}

export default function Homepage() {

    const [followings, setFollowings] = useState<User[]>([]);
    const [content, setContent] = useState<Content[]>([]);
    const [loading, setLoading] = useState(false);
    const user_id = useSelector((state: RootState) => state.auth.user_id);

    const fetchFollowing = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8080/following/get-followings/${user_id}`);
            setFollowings(res.data);
        } catch (err) {
            console.error("Failed to load followings:", err);
        } finally {
            setLoading(false);
        }
    };

    const latestContent = async () => {
        if (followings.length === 0) {
            return;
        }
        setLoading(true);
        console.log(followings.map((following: User) => following.user_id));
        try {
            const res = await axios.post(`http://localhost:8080/content/get-latest-content`, {
                followings: followings.map((following: User) => following.user_id)
            });
            setContent(res.data.posts);
        } catch (err) {
            console.error("Failed to load latest content:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchFollowing();
    }, []);
    useEffect(() => {
        latestContent();
    }, [followings]);

    const formatLikes = (likes: number) => {
        if (likes >= 1000000) {
            return `${(likes / 1000000).toFixed(1)}M`;
        } else if (likes >= 1000) {
            return `${(likes / 1000).toFixed(1)}K`;
        }
        return likes.toString();
    };

    if (loading) {
        return <LoadingHomepage/>
    }


    return (
        <div className="bg-black min-h-screen text-white">
            <div className="max-w-md mx-auto">
                {/* Stories Section */}
                <div className="flex overflow-x-auto p-4 space-x-4 scrollbar-hide">
                    {followings.map((following: User) => (
                        <div key={following.user_id} className="flex flex-col items-center space-y-1 min-w-0">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-0.5">
                                <div className="w-full h-full rounded-full bg-black p-0.5">
                                    <img
                                        src={following.profile_picture}
                                        alt={following.username}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>
                            </div>
                            <span className="text-xs text-white truncate max-w-16">{following.username}</span>
                        </div>
                    ))}
                </div>

                {/* Posts Section */}
                <div className="space-y-6">
                    {content.map((post: Content) => (
                        <div key={post.content_id} className="bg-black">
                            {/* Post Header */}
                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-0.5">
                                        <div className="w-full h-full rounded-full bg-black p-0.5">
                                            <img
                                                src={post.profile_picture}
                                                alt={post.username}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className="text-white font-semibold text-sm">{post.username}</span>
                                        <span className="text-gray-400 text-sm">• {getTimeAgo(post.created_at)}</span>
                                    </div>
                                </div>
                                <MoreHorizontal className="w-6 h-6 text-white" />
                            </div>

                            {/* Post Image */}
                            <div className="aspect-square w-full">
                                <img
                                    src={post.media}
                                    alt={post.caption}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Post Actions */}
                            <div className="p-3">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-4">
                                        <Heart className="w-6 h-6 text-white hover:text-red-500 cursor-pointer" />
                                        <MessageCircle className="w-6 h-6 text-white cursor-pointer" />
                                        <Send className="w-6 h-6 text-white cursor-pointer" />
                                    </div>
                                    <Bookmark className="w-6 h-6 text-white cursor-pointer" />
                                </div>

                                {/* Likes Count */}
                                <div className="mb-2">
                                    <span className="text-white font-semibold text-sm">
                                        {formatLikes(post.likes)} likes
                                    </span>
                                </div>

                                {/* Caption */}
                                {post.caption && (
                                    <div className="text-white text-sm">
                                        <span className="font-semibold">{post.username}</span>
                                        <span className="ml-2">{post.caption}</span>
                                    </div>
                                )}

                                {/* View Comments */}
                                {post.comments > 0 && (
                                    <div className="mt-2">
                                        <span className="text-gray-400 text-sm cursor-pointer">
                                            View all {post.comments} comments
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}