'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';
import { setIsLoading, setUserInfo } from './redux/slices/authslice';
import { setActiveTab } from './redux/slices/sidebarslice';
import { connectSocket } from '../lib/socket';

const AuthInit = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();

  // 📌 Update active tab based on route
  useEffect(() => {
    const staticPathTabMap: { [key: string]: string } = {
      '/': 'home',
      '/explore': 'explore',
      '/notifications': 'notifications',
      '/search': 'search',
      '/reels': 'reels',
    };

    if (staticPathTabMap[pathname]) {
      dispatch(setActiveTab({ activeTab: staticPathTabMap[pathname] }));
    } else if (pathname.startsWith('/profile')) {
      dispatch(setActiveTab({ activeTab: 'profile' }));
    } else if (pathname.startsWith('/direct')) {
      dispatch(setActiveTab({ activeTab: 'messages' }));
    }
  }, [pathname, dispatch]);

  // 🔐 Check user auth and connect socket
  useEffect(() => {
    dispatch(setIsLoading(true));

    axios
      .get('http://localhost:8080/users/isauth', { withCredentials: true })
      .then((res) => {
        if (res.data.loggedIn) {
          const { username, user_id, profile_picture } = res.data;

          dispatch(
            setUserInfo({
              username,
              isLoggedIn: true,
              user_id,
              profile_pic: profile_picture,
            })
          );

          connectSocket(user_id); // 🎯 Connect socket only after login
        }
      })
      .catch((error) => {
        console.error('Auth check failed:', error.message);
      })
      .finally(() => {
        dispatch(setIsLoading(false));
      });
  }, [dispatch]);

  return null;
};

export default AuthInit;
