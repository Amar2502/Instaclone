"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleUserRound, Send } from "lucide-react";

export default function Inbox() {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-[300px] border-r border-zinc-800 flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <span className="text-lg font-bold">amar.pa25</span>
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

        <div className="px-4 pb-2">
          <Input placeholder="Search" className="bg-zinc-900 text-white" />
        </div>

        <div className="px-4 text-xs text-muted-foreground mt-4">Messages</div>
        <div className="px-4 text-xs text-blue-500">No messages found.</div>
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
    </div>
  );
}
