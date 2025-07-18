"use client";

import axios from "axios";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface Post {
  content_id: number;
  media: string;
  content_type: string;
  caption: string;
  created_at: string;
  likes: number;
  comments: number;
}

const Posts = ({ user_id, username }: { user_id: number, username: string }) => {
  const [post, setPost] = useState<Post[] | null>(null);

  const author = useSelector((state: RootState) => state.auth.username);

  const isSafe = author === username;

  useEffect(() => {
    if (!user_id) return; // ⛔ Don't fetch if user_id is invalid
    axios
      .get(`http://localhost:8080/posts/get-posts/${user_id}`)
      .then((res) => setPost(res.data.posts))
      .catch((err) => console.error(err));
  }, [user_id]);

  const handleUploadPost = async () => {
    if (!user_id) return; // ⛔ Don't open upload if user_id is invalid

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("user_id", user_id.toString());
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
        const refreshed = await axios.get(`http://localhost:8080/posts/get-posts/${user_id}`);
        setPost(refreshed.data.posts);
      } catch (err) {
        console.error("Upload Failed:", err);
      }
    };

    fileInput.click();
  };

  if (!user_id) return null; // ⛔ Don't render anything until user_id is valid

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
                  className="aspect-auto bg-gray-100 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <img
                    src={postItem.media}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Posts;
