'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  Grid3X3,
  Bookmark,
  Users,
  Camera,
  Plus,
  Settings,
  MoreHorizontal,
} from 'lucide-react';

import Posts from './posts';
import Saved from './saved';
import Tagged from './tagged';

import { cropToSquareAndCompress } from '@/lib/croptosquareandcompress';
import { Button } from '@/components/ui/button';
import { FollowersDialog } from '@/components/self/followersdialog';
import { FollowingDialog } from '@/components/self/followingdialog';
import { setProfilePic } from '@/app/redux/slices/authslice';
import type { RootState } from '@/app/redux/store';

const TABS = [
  { name: 'posts', icon: <Grid3X3 size={20} /> },
  { name: 'saved', icon: <Bookmark size={20} /> },
  { name: 'tagged', icon: <Users size={20} /> },
];

interface User {
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

export default function Profile() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const username = pathname.split('/')[1];
  const activeTab = searchParams.get('tab') || 'posts';

  const author = useSelector((state: RootState) => state.auth.username);
  const author_id = useSelector((state: RootState) => state.auth.user_id);
  const isAuthor = author === username;

  const [user, setUser] = useState<User | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  // Fetch user details
  useEffect(() => {
    axios
      .get(`http://localhost:8080/users/${username}`, {
        params: { author_id },
      })
      .then((res) => setUser(res.data.user))
      .catch((err) => console.error('Fetch user error:', err));
  }, [username, author_id]);

  // Upload profile image
  const handleImageUpload = async (file: File) => {
    if (!file || !isAuthor) return;

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const processed = await cropToSquareAndCompress(file);
      const formData = new FormData();

      formData.append('file', processed);
      formData.append('username', username);

      const res = await axios.post(
        'http://localhost:8080/users/upload-profile-picture',
        formData,
        { withCredentials: true }
      );

      dispatch(setProfilePic(res.data.url));
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  // Change tab view
  const changeTab = (tab: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('tab', tab);
    router.push(`/${username}?${newParams}`);
  };

  // Follow user
  const handleFollow = async () => {
    if (!author_id || !user) return;

    try {
      await axios.post('http://localhost:8080/following/follow-user', {
        user_id: author_id,
        following_id: user.user_id,
      });

      setUser((prev) =>
        prev ? { ...prev, followers: prev.followers + 1, isFollowing: true } : prev
      );
    } catch (err) {
      console.error('Follow failed:', err);
    }
  };

  const handleUnfollow = async () => {
    if (!author_id || !user) return;

    try {
      await axios.post('http://localhost:8080/following/unfollow-user', {
        user_id: author_id,
        following_id: user.user_id,
      });

      setUser((prev) =>
        prev ? { ...prev, followers: prev.followers - 1, isFollowing: false } : prev
      );
    } catch (err) {
      console.error('Unfollow failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <div className="flex-1 flex flex-col m-3">
        <div className="max-w-[935px] w-full mx-auto px-5 pt-8">
          {/* Header */}
          <div className="flex gap-10 mb-11">
            {/* Profile Picture */}
            <div className="relative w-[170px] h-[170px]">
              <div
                onClick={isAuthor ? () => inputRef.current?.click() : undefined}
                className={`w-full h-full rounded-full overflow-hidden relative ${isAuthor ? 'cursor-pointer group' : ''}`}
              >
                <img
                  src={preview || user?.profile_picture}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />

                {isAuthor && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <Camera size={48} className="text-white" strokeWidth={1} />
                  </div>
                )}

                {uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full z-10">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {isAuthor && (
                <input
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  onChange={(e) => handleImageUpload(e.target.files?.[0] as File)}
                  className="hidden"
                />
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 flex flex-col gap-4 pt-2">
              <div className="flex flex-wrap items-center gap-4">
                <h2 className="text-2xl">{user?.username}</h2>

                {isAuthor ? (
                  <>
                    <Button className="btn-secondary rounded-lg">Edit Profile</Button>
                    <Settings size={22} className="hover:text-[#a8a8a8] cursor-pointer" strokeWidth={1.5} />
                  </>
                ) : (
                  <>
                    <Button
                      className="rounded-lg bg-blue-600 hover:bg-blue-500"
                      onClick={user?.isFollowing ? handleUnfollow : handleFollow}
                    >
                      {user?.isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button className="btn-secondary rounded-lg">Message</Button>
                    <MoreHorizontal size={22} className="hover:text-[#a8a8a8] cursor-pointer" strokeWidth={1.5} />
                  </>
                )}
              </div>

              <div className="flex gap-8">
                <div><span className="font-medium">{user?.posts}</span> posts</div>
                <FollowersDialog
                  user_id={user?.user_id || 0}
                  trigger={
                    <div className="cursor-pointer">
                      <span className="font-medium">{user?.followers}</span> followers
                    </div>
                  }
                />
                <FollowingDialog
                  user_id={user?.user_id || 0}
                  trigger={
                    <div className="cursor-pointer">
                      <span className="font-medium">{user?.followings}</span> following
                    </div>
                  }
                />
              </div>

              <div className="text-sm font-semibold">{user?.fullName}</div>
            </div>
          </div>

          {/* Upload New Post */}
          {isAuthor && (
            <div className="flex mb-11">
              <div className="flex flex-col items-center mr-8 cursor-pointer hover:border-[#a8a8a8] transition-colors">
                <div className="w-[77px] h-[77px] border-2 border-[#262626] rounded-full flex items-center justify-center mb-1">
                  <Plus size={44} className="text-[#a8a8a8]" strokeWidth={1} />
                </div>
                <span className="text-xs text-[#a8a8a8]">New</span>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-t border-[#262626]">
            <div className="flex justify-center">
              {TABS.filter((tab) => isAuthor || tab.name !== 'saved').map((tab, i) => (
                <div
                  key={tab.name}
                  className={`flex items-center justify-center px-0 py-4 cursor-pointer ${
                    activeTab === tab.name ? 'border-t border-white' : 'text-[#a8a8a8] hover:text-white transition-colors'
                  } ${i !== TABS.length - 1 ? 'mr-[60px]' : ''}`}
                  onClick={() => changeTab(tab.name)}
                >
                  <span className="mr-[6px]">{tab.icon}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {!user?.user_id ? (
            <div className="text-center py-10">Loading profile...</div>
          ) : (
            <>
              {activeTab === 'posts' && <Posts User={user} />}
              {isAuthor && activeTab === 'saved' && <Saved />}
              {activeTab === 'tagged' && <Tagged username={user.username} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}