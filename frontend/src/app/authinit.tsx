// app/AuthInit.tsx
'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserInfo } from './redux/slices/authslice';

const AuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get('http://localhost:8080/users/isauth', { withCredentials: true })
      .then((res) => {
        if (res.data.loggedIn) {
          console.log(res.data);
          dispatch(setUserInfo({ username: res.data.username, isLoggedIn: true }));
        }
      })
      .catch((err) => {
        console.error('Auth check failed:', err);
      });
  }, []);

  return null; // no UI needed
};

export default AuthInit;
