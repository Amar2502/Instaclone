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

export default function Inbox() {

  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchBar, setSearchBar] = useState(false);
  const author_id = useSelector((state: RootState) => state.auth.user_id);
  const username = useSelector((state: RootState) => state.auth.username);
  const [previousMessagesProfiles, setPreviousMessagesProfiles] = useState<PreviousMessagesProfiles[]>([]);

  console.log(author_id);

  const fetchPreviousMessagesProfiles = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/messages/previous-messages-profiles/${author_id}`);
      console.log(res.data);
      setPreviousMessagesProfiles(res.data.profiles);
    } catch (err) {
      console.error("Failed to load previous messages profiles:", err);
    }
  }

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

  useEffect(() => {
    fetchPreviousMessagesProfiles();
  }, []);

  const searchbarclicked = () => {
    setSearchBar(true);
    if (users.length > 0) {
      return;
    }
    setLoading(true);
    fetchConnectedUsers();
  }

  console.log("previousMessagesProfiles", previousMessagesProfiles);

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
                <Link href={`/direct/t/${user.user_id}`} className="w-full flex items-center gap-3">
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

        {previousMessagesProfiles.length > 0 ? (
          <div className="mt-2 space-y-2 overflow-y-auto">
            {previousMessagesProfiles.map((user) => (
              <Link href={`/direct/t/${user.sender_id === author_id ? user.receiver_id : user.sender_id}`} className="w-full flex items-center gap-3">
                <div key={user.user_id} className="w-full flex items-center gap-3 p- hover:bg-zinc-700 cursor-pointer">
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

      {/* Message Area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 flex items-center justify-center border border-white rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="text-white"
            >
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5.414l-4.707 2.354A.5.5 0 0 1 0 13.914V4z" />
            </svg>
          </div>
          <div className="text-lg font-semibold">Your messages</div>
          <p className="text-sm text-muted-foreground">
            Send a message to start a chat.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">Send message</Button>
        </div>
      </div>
    </div >
  );
}
