"use client";

import axios from "axios";
import { Bookmark, Camera, Heart, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getFormattedDate, getTimeAgo } from "@/lib/getFormattedDate";
import HeartToggle from "../utils/hearttoggle";

interface Post {
  content_id: number;
  media: string;
  content_type: string;
  caption: string;
  created_at: string;
  likes: number;
  comments: number;
}

interface PostsProps {
  User: {
    user_id: number;
    username: string;
    profile_picture: string;
    fullName: string;
    bio: string;
    followers: number;
    followings: number;
    posts: number;
    isFollowing: boolean;
  }
}

interface Comment {
  comment_id: number;
  user_id: number;
  content_id: number;
  content_type: string;
  comment_text: string;
  comment_likes: number;
  created_at: string;
}

const Posts = ({ User }: PostsProps) => {
  const [post, setPost] = useState<Post[] | null>(null);

  const author = useSelector((state: RootState) => state.auth.username);

  const isSafe = author === User.username;

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const [comment, setComment] = useState<string>("");

  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!User.user_id) return;
    axios
      .get(`http://localhost:8080/posts/get-posts/${User.user_id}`)
      .then((res) => setPost(res.data.posts))
      .catch((err) => console.error(err));
  }, [User.user_id]);

  const handlePostComment = async () => {

    console.log(comment);

    setComment("");

    setComments([...comments, {
      comment_id: 1,
      user_id: 1,
      content_id: 1,
      content_type: "post",
      comment_text: comment,
      comment_likes: 0,
      created_at: new Date().toISOString(),
    }]);

  }

  const handleUploadPost = async () => {
    if (!User.user_id) return;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("user_id", User.user_id.toString());
      formData.append("caption", "Test Caption");
      formData.append("content_type", "post");
      formData.append("file", file);

      try {
        const res = await axios.post(
          "http://localhost:8080/posts/set-post",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        // Re-fetch posts
        const refreshed = await axios.get(`http://localhost:8080/posts/get-posts/${User.user_id}`);
        setPost(refreshed.data.posts);
      } catch (err) {
        console.error("Upload Failed:", err);
      }
    };

    fileInput.click();
  };

  if (!User.user_id) return null; // ⛔ Don't render anything until user_id is valid

  return (
    <div className="pt-[35px] pb-8">
      {post?.length === 0 || post === null ? (
        <div className="flex justify-center space-x-[60px]">
          <div className="text-center max-w-[200px]">
            <div className="w-[62px] h-[62px] border border-[#262626] rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera size={24} />
            </div>
            <h3 className="text-[17px] font-semibold mb-4 text-white">
              {isSafe ? "Share Photos" : "No Posts Yet"}
            </h3>
            <p className="text-[14px] text-[#a8a8a8] mb-6 leading-[18px]">
              {isSafe
                ? "When you share photos, they will appear on your profile."
                : "This user hasn’t posted any photos yet."}
            </p>
            {isSafe && (
              <button
                className="btn-primary cursor-pointer text-indigo-600"
                onClick={handleUploadPost}
              >
                Share your first photo
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto p-4">
          {/* Posts Grid */}
          <div className="grid grid-cols-3 gap-1 md:gap-2">
            {post.map((postItem) =>
              postItem.content_type === "post" && (
                <div
                  key={postItem.content_id}
                  className="relative group aspect-auto bg-gray-100 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedPost(postItem)}
                >
                  <img
                    src={postItem.media}
                    alt=""
                    className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-70"
                  />

                  {/* Overlay for comment count */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 text-white font-semibold text-sm">
                    <MessageCircle size={20} /> <span className="ml-2 text-[18px] font-bold">{postItem.comments}</span>
                  </div>
                </div>
              )
            )}

          </div>
        </div>
      )}

      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-zinc-900 text-white rounded-lg overflow-hidden max-w-5xl w-full h-[85vh] flex relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-2 right-2 text-white hover:text-red-400 text-2xl"
            >
              <X size={24} className="cursor-pointer" />
            </button>

            {/* Left: Image */}
            <div className="w-1/2 h-full">
              <img
                src={selectedPost.media}
                alt="Post"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Details */}
            <div className="w-1/2 h-full flex flex-col">
              {/* Header */}
              <div className="p-4 flex items-center gap-2 border-b border-zinc-800">
                <img
                  src={User.profile_picture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <h2 className="font-bold text-sm">{User.username}</h2>
              </div>

              {/* Scrollable Caption */}
              <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto">
                <div className="flex gap-3 items-start">
                  <img
                    src={User.profile_picture}
                    alt="Profile"
                    className="w-7 h-7 rounded-full"
                  />
                  <div>
                    <div className="flex flex-wrap gap-1 items-center">
                      <p className="font-semibold text-sm">{User.username}</p>
                      <p className="text-sm text-gray-200">{selectedPost.caption}</p>
                    </div>
                  </div>
                </div>
                {comments.map((comment) => (
                  <div key={comment.comment_id} className="flex gap-3 items-start">
                    <img src={User.profile_picture} alt="Profile" className="w-7 h-7 rounded-full" />
                    <div className="flex flex-col gap-0.5">
                      <div className="flex gap-1 items-center">
                        <p className="font-semibold text-sm">{User.username}</p>
                        <p className="text-sm">{comment.comment_text}</p>
                      </div>
                      <p className="text-xs text-gray-400">{getTimeAgo(comment.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer: Actions + Likes + Date + Input */}
              <div className="border-t border-zinc-800 p-4 space-y-3">
                {/* Action Icons */}
                <div className="text-sm text-gray-400 flex justify-between gap-2">
                  <div className="flex gap-3">
                    <HeartToggle
                      size={20}
                      initial={false}
                      onChange={(liked) => {
                        if (!liked) {
                          setSelectedPost({ ...selectedPost, likes: selectedPost.likes - 1 });
                        } else {
                          setSelectedPost({ ...selectedPost, likes: selectedPost.likes + 1 });
                        }
                        console.log("Now liked:", liked);
                      }}
                    />

                    <MessageCircle 
                      size={20} 
                      className="cursor-pointer text-white" 
                      onClick={() => {
                        const input = document.querySelector('input[aria-label="Add a comment"]');
                        if (input instanceof HTMLInputElement) {
                          input.focus();
                        }
                      }}
                    />
                    <Send size={20} className="cursor-pointer text-white" />
                  </div>
                  <Bookmark size={20} className="cursor-pointer text-white" />
                </div>

                {/* Like Info and Date */}
                <div className="text-xs text-gray-400 space-y-1">
                  {selectedPost.likes === 0 ? (
                    <p className="text-gray-200">Be the first to like this post</p>
                  ) : (
                    <p>{selectedPost.likes} likes</p>
                  )}
                  <p className="text-[11px] uppercase tracking-wide">
                    {getFormattedDate(selectedPost.created_at)}
                  </p>
                </div>

                {/* Comment Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (comment.trim()) handlePostComment();
                  }}
                  className="relative w-full"
                >
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full pr-20 p-2 rounded bg-zinc-800 text-white focus:outline-none text-sm border-none"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    aria-label="Add a comment"
                  />
                  <button
                    type="submit"
                    disabled={comment.trim().length === 0}
                        className={`absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 text-sm font-medium rounded transition 
                        ${comment.trim().length === 0
                        ? "opacity-50"
                        : "hover:underline cursor-pointer"}`}
                    aria-disabled={comment.trim().length === 0}
                  >
                    Post
                  </button>
                </form>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Posts;
