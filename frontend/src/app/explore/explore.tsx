"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface Content {
  content_id: number;
  user_id: number;
  media: string;
  content_type: string; // "post" or "reel"
  created_at: string;
  caption: string;
  likes: number;
  comments: number;
}

const Explore = () => {
  const [content, setContent] = useState<Content[]>([]);
  const user_id = useSelector((state: any) => state.auth.user_id);

  useEffect(() => {
    if (!user_id) return;

    axios
      .get(`http://localhost:8080/content/explore/${user_id}`)
      .then((res: any) => setContent(res.data.contents))
      .catch((err: any) => console.log(err));
  }, [user_id]);

  return (
    <div className="p-4">
      {content.length === 0 ? (
        <div className="w-full text-center text-zinc-400 text-lg py-10">
          Nothing much to see right now.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
          {content.map((item) => (
            <div
              key={item.content_id}
              className="relative group w-full aspect-square overflow-hidden"
            >
              {item.content_type === "post" ? (
                <img
                  src={item.media}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
              ) : item.content_type === "reel" ? (
                <video
                  src={item.media}
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : null}

              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-sm font-semibold">
                ❤️ {item.likes} &nbsp; 💬 {item.comments}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
