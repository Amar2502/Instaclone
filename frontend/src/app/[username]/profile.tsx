'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Grid3X3, Bookmark, Users, Camera, Plus, Settings } from 'lucide-react';

import Posts from './posts';
import Saved from './saved';
import Tagged from './tagged';
import type { RootState } from '@/app/redux/store';
import axios from 'axios';

interface User {
  username: string;
  profile_picture: string;
  fullName: string;
  bio: string;
  followers: number;
  followings: number;
  posts: number;
}

const TABS = [
  { name: 'posts', icon: <Grid3X3 size={12} /> },
  { name: 'saved', icon: <Bookmark size={12} /> },
  { name: 'tagged', icon: <Users size={12} /> },
];

const Profile: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  const author = useSelector((state: RootState) => state.auth.username);
  const urlUsername = pathname.split('/')[1];
  const activeTab = searchParams.get('tab') || 'posts';
  const isAuthor = author === urlUsername;

  const [user, setUser] = useState<User | null>(null);

  const handleClick = () => inputRef.current?.click();

  const changeTab = (tab: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('tab', tab);
    router.push(`/${urlUsername}?${newParams.toString()}`);
  };

  useEffect(() => {
    axios.get(`http://localhost:8080/users/${urlUsername}`)
    .then((res) => {
      console.log(res.data.user);
      setUser(res.data.user);
    })
    .catch((err) => {
      console.log(err);
    });
  }, [urlUsername]);

  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      <div className="flex-1 flex flex-col m-3">
        <div className="flex-1 max-w-[935px] mx-auto w-full px-5 pt-[30px]">

          {/* Profile Header */}
          <div className="flex gap-10 mb-11 items-start">
            {/* Profile Picture */}
            <div className="relative w-[120px] h-[120px]">
              <div
                onClick={handleClick}
                className="w-full h-full rounded-full overflow-hidden relative cursor-pointer group"
              >
                <img
                  src="/placeholder.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full">
                  <Camera size={48} className="text-white" strokeWidth={1} />
                </div>
              </div>
              <input type="file" accept="image/*" ref={inputRef} className="hidden" />
            </div>

            {/* Profile Info */}
            <div className="flex-1 flex flex-col gap-4 pt-2">
              <div className="flex flex-wrap items-center gap-4">
                <h2 className="text-2xl font-normal">{user?.username}</h2>
                {isAuthor && (
                  <>
                    <button className="btn-secondary">Edit Profile</button>
                    <button className="btn-secondary">View Archive</button>
                    <Settings size={22} className="hover:text-[#a8a8a8] cursor-pointer" strokeWidth={1.5} />
                  </>
                )}
              </div>

              <div className="flex gap-8">
                <div>
                  <span className="font-medium">{user?.posts}</span>{' '}
                  <span className="text-[#a8a8a8]">posts</span>
                </div>
                <div>
                  <span className="font-medium">{user?.followers}</span>{' '}
                  <span className="text-[#a8a8a8]">followers</span>
                </div>
                <div>
                  <span className="font-medium">{user?.followings}</span>{' '}
                  <span className="text-[#a8a8a8]">following</span>
                </div>
              </div>

              <div className="text-sm font-semibold">{user?.fullName || 'Full Name'}</div>
            </div>
          </div>

          {/* New Post Button */}
          <div className="flex justify-start mb-11">
            <div className="flex flex-col items-center mr-8">
              <div className="w-[77px] h-[77px] border-2 border-[#262626] rounded-full flex items-center justify-center cursor-pointer hover:border-[#a8a8a8] transition-colors mb-1">
                <Plus size={44} className="text-[#a8a8a8]" strokeWidth={1} />
              </div>
              <span className="text-[12px] text-[#a8a8a8] font-normal">New</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-[#262626]">
            <div className="flex justify-center">
              {TABS.map((tab, i) => (
                <div
                  key={tab.name}
                  className={`flex items-center justify-center px-0 py-4 cursor-pointer ${
                    activeTab === tab.name
                      ? 'border-t border-white'
                      : 'text-[#a8a8a8] hover:text-white transition-colors'
                  } ${i !== TABS.length - 1 && 'mr-[60px]'}`}
                  onClick={() => changeTab(tab.name)}
                >
                  <span className="mr-[6px]">{tab.icon}</span>
                  <span className="text-[12px] font-semibold tracking-[1px] uppercase">{tab.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'posts' && <Posts />}
          {activeTab === 'saved' && <Saved />}
          {activeTab === 'tagged' && <Tagged />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
