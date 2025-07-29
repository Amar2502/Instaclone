"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store";
import { ChevronLeft, ChevronRight, Info, Phone, Smile, Video } from "lucide-react";
import Link from "next/link";
import { getSocket } from "@/lib/socket";

interface Users {
  user_id: number;
  username: string;
  profile_picture: string;
  fullname: string;
}

interface PreviousMessagesProfiles {
  message_id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  timesent: string;
  user_id: number;
  profile_picture: string;
  fullname: string;
}

interface ChatProps {
  user_id: number;
}

export default function Chat({ user_id }: ChatProps) {
  const [users, setUsers] = useState<Users[]>([]);
  const [searchBar, setSearchBar] = useState(false);
  const [user, setUser] = useState<Users | null>(null);
  const [messages, setMessages] = useState<{ from: number; text: string }[]>([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [previousMessagesProfiles, setPreviousMessagesProfiles] = useState<PreviousMessagesProfiles[]>([]);
  const author_id = useSelector((state: RootState) => state.auth.user_id) || 0;
  const username = useSelector((state: RootState) => state.auth.username);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);


  const isUserAtBottom = () => {
    const el = messagesContainerRef.current;
    if (!el) return false;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 150; // within 150px of bottom
  };

  useEffect(() => {
    if (isUserAtBottom()) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  const socket = useRef(getSocket());

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      try {
        const [userRes, messagesRes] = await Promise.all([
          axios.get(`http://localhost:8080/users/get-user-by-id/${user_id}`),
          axios.get(`http://localhost:8080/messages/get-messages/${author_id}/${user_id}`)
        ]);

        setUser(userRes.data);
        setMessages(messagesRes.data.messages.map((msg: any) => ({ from: msg.sender_id, text: msg.message })));
      } catch (err) {
        console.error("Failed to load chat data:", err);
      }
    };

    fetchUserAndMessages();
    fetchPreviousMessagesProfiles();
  }, [user_id]);

  const fetchPreviousMessagesProfiles = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/messages/previous-messages-profiles/${author_id}`);
      console.log(res.data);
      setPreviousMessagesProfiles(res.data.profiles);
    } catch (err) {
      console.error("Failed to load previous messages profiles:", err);
    }
  }

  useEffect(() => {
    if (!socket.current) return;

    socket.current.on("receive-message", (senderId: number, text: string) => {
      setMessages((prev) => [...prev, { from: senderId, text }]);
    });

    socket.current.on("is-typing", () => setIsTyping(true));
    socket.current.on("stop-typing", () => setIsTyping(false));

    return () => {
      socket.current?.off("receive-message");
      socket.current?.off("is-typing");
      socket.current?.off("stop-typing");
    };
  }, []);

  const fetchConnectedUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/users/connected-to-users/${author_id}`);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load followers:", err);
    }
  };

  const handleSearchClick = () => {
    setSearchBar(true);
    if (users.length === 0) fetchConnectedUsers();
  };

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    try {
      await axios.post("http://localhost:8080/messages/send-message", {
        sender_id: author_id,
        receiver_id: user_id,
        message: trimmed,
      });

      setMessages((prev) => [...prev, { from: author_id, text: trimmed }]);
      setMessage("");
      socket.current?.emit("send-message", author_id, user_id, trimmed);
      socket.current?.emit("stop-typing", user_id, author_id);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleTyping = () => {
    if (!socket.current) return;

    socket.current.emit("is-typing", user_id, author_id);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.current?.emit("stop-typing", user_id, author_id);
      setIsTyping(false);
    }, 2000);
  };

  useEffect(() => {
    if (message.length > 0) {
      socket.current.emit("stop-typing", user_id, author_id);
    }
  }, [message]);

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-[300px] border-r border-zinc-800 flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <span className="text-lg font-bold">{username}</span>
          <Button variant="ghost" size="icon">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="h-5 w-5">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
            </svg>
          </Button>
        </div>

        <div className="px-2 pb-2">
          {searchBar ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setSearchBar(false)}><ChevronLeft /></Button>
              <Input placeholder="Search" className="bg-zinc-900 text-white" onClick={handleSearchClick} />
            </div>
          ) : (
            <Input placeholder="Search" className="bg-zinc-900 text-white" onClick={handleSearchClick} />
          )}

          {users.length > 0 && searchBar && (
            <div className="mt-2 space-y-2 overflow-y-auto max-h-[40vh]">
              {users.map((u) => (
                <Link href={`/direct/t/${u.user_id}`} key={u.user_id} className="block">
                  <div className="w-full flex items-center gap-3 p-2 hover:bg-zinc-700 cursor-pointer">
                    <img src={u.profile_picture} alt={u.username} className="w-12 h-12 rounded-full" />
                    <div>
                      <div className="text-sm font-medium">{u.fullname}</div>
                      <div className="text-xs text-muted-foreground">@{u.username}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {previousMessagesProfiles.length > 0 ? (
          <div className="mt-2 space-y-2 overflow-y-auto">
            {previousMessagesProfiles.map((user) => (
              <Link
                key={user.message_id} // or use user.user_id if unique
                href={`/direct/t/${user.sender_id === author_id ? user.receiver_id : user.sender_id}`}
                className="w-full flex items-center gap-3"
              >
                <div className="w-full flex items-center gap-3 p-2 hover:bg-zinc-700 cursor-pointer">
                  <img
                    src={user.profile_picture}
                    alt={user.fullname}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="text-sm font-medium">{user.fullname}</div>
                    {user.sender_id === author_id ? (
                      <div className="text-xs text-muted-foreground">You: {user.message}</div>
                    ) : (
                      <div className="text-xs text-muted-foreground">{user.message}</div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-4 text-xs text-muted-foreground mt-4">No messages found.</div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-black text-white relative">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-[#0d0d0d] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <img src={user?.profile_picture} alt="User" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="text-sm font-semibold">{user?.fullname}</div>
              <div className="text-xs text-gray-400">@{user?.username}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-300">
            <Phone size={20} className="hover:text-white cursor-pointer" />
            <Video size={24} className="hover:text-white cursor-pointer" />
            <Info size={24} className="hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Messages Section */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-2 scrollbar-thin scrollbar-thumb-zinc-700"
        >
          <div className="flex flex-col items-center justify-center py-8">
            <img src={user?.profile_picture} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
            <div className="text-xl font-semibold mt-2">{user?.fullname}</div>
            <div className="text-sm text-gray-400">{user?.username} · Instagram</div>
            <Link
              href={`/${user?.username}`}
              className="bg-[#353535] px-4 py-1 rounded-md mt-2 hover:bg-[#444] text-sm"
            >
              View profile
            </Link>
          </div>

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === author_id ? "justify-end" : "justify-start"} items-end`}
            >
              {msg.from !== author_id && (
                <img
                  src={user?.profile_picture}
                  alt="User"
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                />
              )}
              <div
                className={`px-3 py-2 rounded-2xl max-w-xs text-sm break-words ${msg.from === author_id ? "bg-blue-600" : "bg-[#2c2c2c]"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="text-sm text-gray-400">Typing...</div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>


        {/* Input */}
        <div className="border m-2 rounded-full border-zinc-800 px-6 py-3 bg-black flex items-center space-x-2 relative">
          <Smile size={20} className="cursor-pointer" />
          <input
            type="text"
            placeholder="Message..."
            className="flex-1 bg-transparent text-white outline-none placeholder-gray-400"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            onKeyUp={handleTyping}
          />
          <button className="text-white text-lg cursor-pointer hover:text-blue-500" onClick={sendMessage}>
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
}
