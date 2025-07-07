"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, User, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store";
import { useRouter } from "next/navigation";

interface Account {
  user_id: number;
  username: string;
  fullname: string;
  profile_picture: string;
}

export default function Onboarding() {

  const router = useRouter();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const username = useSelector((state: RootState) => state.auth.username);
  const user_id = useSelector((state: RootState) => state.auth.user_id);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/users/get-some-accounts/${username}`, {
        withCredentials: true,
      });
      setAccounts(response.data.accounts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSelect = (acc: Account) => {
    setSelectedAccounts((prev) => {
      const exists = prev.find((a) => a.user_id === acc.user_id);
      if (exists) {
        return prev.filter((a) => a.user_id !== acc.user_id);
      } else {
        return [...prev, acc];
      }
    });
  };

  const handleNext = () => {
    console.log("Selected accounts:", selectedAccounts);
    axios.post("http://localhost:8080/following/follow-user", {
      user_id: user_id,
      following_ids: selectedAccounts.map((acc) => acc.user_id),
    }, {
      withCredentials: true,
    })
    .then((res) => {
      console.log(res.data);
      router.push("/");
    })
    .catch((err) => {
      console.log(err);
    });

  };

  return (
    <div className="flex h-full bg-black text-white overflow-y-auto">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-lg mx-auto space-y-8">
          {/* Header */}
          <div className="my-6 flex items-center gap-4">
            {/*logo design */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                  <User className="text-orange-500" size={24} />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                  <User className="text-orange-500" size={12} />
                </div>
              </div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                  <User className="text-orange-500" size={12} />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center">
                  <User className="text-orange-500" size={8} />
                </div>
              </div>
            </div>
            {/*text design */}
            <div className="text-center mb-3 space-y-1">
              <p className="text-lg font-semibold">Find friends and accounts you like</p>
              <p className="text-sm text-gray-400">
                Try following 5 or more accounts for a personalized experience.
              </p>
            </div>
            {/*button design */}
            <div className="flex gap-3 justify-center">
              <Button
                className="bg-blue-600 hover:bg-blue-700 px-6 text-white text-sm rounded-md shadow cursor-pointer"
                onClick={handleNext}
              >
                Next
              </Button>
            </div>
          </div>
          <hr/>
          {/* Search Input */}
          <div className="mb-4 flex gap-2">
            <Input
              placeholder="Search"
              className="h-10 bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-gray-400 rounded-md"
              disabled={loading}
            />
            {/*refresh button design */}
            <div className="flex gap-3 justify-center">
              <Button
                variant="ghost"
                className="flex gap-2 px-4 py-2 cursor-pointer"
                onClick={fetchAccounts}
                disabled={loading}
                title="Refresh accounts"
              >
                <RefreshCw className={loading ? "animate-spin" : ""} size={18} />
                {/* Refresh */}
              </Button>
            </div>
          </div>

          {/* Account List */}
          <div className="space-y-2">
            {accounts.length === 0 && !loading && (
              <div className="text-center text-gray-400 py-8">No accounts found.</div>
            )}
            {loading && (
              <div className="text-center text-gray-400 py-8">Loading accounts...</div>
            )}
            {accounts.map((acc, i) => {
              const selected = selectedAccounts.some((a) => a.user_id === acc.user_id);
              return (
                <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-800">
                  <div className="flex gap-3 items-center">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={acc.profile_picture} />
                      <AvatarFallback>{acc.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                      <p className="text-sm font-medium text-white">{acc.username}</p>
                      <p className="text-xs text-gray-400">{acc.fullname}</p>
                      <p className="text-xs text-gray-500">Suggested for you</p>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer transition-colors duration-200 ${selected ? "border-blue-500" : "border-gray-600"}`}
                    onClick={() => handleSelect(acc)}
                    title={selected ? "Deselect" : "Select"}
                  >
                    {selected && <div className="w-3 h-3 rounded-full bg-blue-500" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Messages Button */}
          <div className="fixed bottom-5 right-5">
            <Button className="rounded-full bg-zinc-800 hover:bg-zinc-700 text-white shadow-md px-5 py-3 flex items-center gap-2">
              <MessageCircle size={20} />
              Messages
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
