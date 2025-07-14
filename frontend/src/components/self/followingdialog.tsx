"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import axios from "axios";

interface Following {
  user_id: number;
  username: string;
  profile_picture: string;
  fullname: string;
}

export function FollowingDialog({ trigger, user_id }: { trigger: React.ReactNode, user_id: number }) {
  const [following, setFollowing] = useState<Following[]>([]);
  const [loading, setLoading] = useState(false); // Start as false
  const [open, setOpen] = useState(false);       // Track open state

  const fetchFollowing = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/following/get-followings/${user_id}`);
      setFollowing(res.data);
    } catch (err) {
      console.error("Failed to load followings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && following.length === 0) {
      fetchFollowing();
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-black text-white border border-zinc-800 shadow-lg rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-white">Following</DialogTitle>
        </DialogHeader>

        <div className="flex-1 px-4">
          {loading ? (
            <div className="flex flex-col gap-4 py-16">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full bg-zinc-700" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px] bg-zinc-700" />
                    <Skeleton className="h-4 w-[150px] bg-zinc-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : following.length > 0 ? (
            following.map((acc) => (
              <Link key={acc.user_id} href={`/${acc.username}`} className="block">
                <div className="flex items-center gap-3 py-3 border-b border-zinc-800 hover:bg-zinc-800 px-2 rounded-md transition-colors">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={acc.profile_picture}
                      alt={acc.username}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/default-profile.png";
                      }}
                    />
                    <AvatarFallback>{acc.username[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{acc.username}</p>
                    <p className="text-xs text-gray-400">{acc.fullname}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center text-zinc-500 py-12">No followings found.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
