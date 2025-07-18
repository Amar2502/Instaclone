'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setIsLoading, setUserInfo } from './redux/slices/authslice';
import { connectSocket } from '../lib/socket'; // 🔁 import your socket connector

const AuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setIsLoading(true));

    axios.get('http://localhost:8080/users/isauth', { withCredentials: true })
      .then((res) => {
        if (res.data.loggedIn) {
          const { username, user_id, profile_picture } = res.data;

          dispatch(setUserInfo({
            username,
            isLoggedIn: true,
            user_id,
            profile_pic: profile_picture
          }));

          connectSocket(user_id); // 🔌 connect socket here after login
        }
        dispatch(setIsLoading(false));
      })
      .catch((err) => {
        dispatch(setIsLoading(false));
      });
  }, [dispatch]);

  return null;
};

export default AuthInit;