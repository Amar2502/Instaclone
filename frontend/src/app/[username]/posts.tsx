"use client";

import axios from "axios";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";

interface Post {
  content_id: number;
  media: string;
  content_type: string;
  caption: string;
  created_at: string;
  likes: number;
  comments: number;
}

const Posts = ({ user_id }: { user_id: number }) => {
  const [post, setPost] = useState<Post[] | null>(null);

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
        console.log("Upload Success:", res.data);

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

  console.log("post from posts.tsx", post);

  return (
    <div className="pt-[35px] pb-8">
      {post?.length === 0 || post === null ? (
        <div className="flex justify-center space-x-[60px]">
          <div className="text-center max-w-[200px]">
            <div className="w-[62px] h-[62px] border border-[#262626] rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera size={24} />
            </div>
            <h3 className="text-[17px] font-semibold mb-4 text-white">Share Photos</h3>
            <p className="text-[14px] text-[#a8a8a8] mb-6 leading-[18px]">
              When you share photos, they will appear on your profile.
            </p>
            <button
              className="btn-primary cursor-pointer text-indigo-600"
              onClick={handleUploadPost}
            >
              Share your first photo
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-4">
            {post.map((post) => (
              <div
                key={post.content_id}
                className="flex flex-col items-center justify-center"
              >
                {post.content_type === "post" && (
                  <img
                    src={post.media}
                    alt={post.caption}
                    className="max-w-[500px] w-full h-auto rounded-lg"
                  />
                )}
                <div className="text-center mt-4">
                  <p className="text-white text-sm">{post.caption}</p>
                  <p className="text-gray-400 text-xs">
                    {new Date(post.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default Posts;
