'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setIsLoading, setUserInfo } from './redux/slices/authslice';

const AuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setIsLoading(true)); // Start loading

    axios.get('http://localhost:8080/users/isauth', { withCredentials: true })
      .then((res) => {
        if (res.data.loggedIn) {
          dispatch(setUserInfo({ username: res.data.username, isLoggedIn: true, user_id: res.data.user_id, profile_pic: res.data.profile_picture }));
          console.log('User info set');
        } else {
          console.log('User is not logged in');
        }
        dispatch(setIsLoading(false)); // ✅ Always stop loading
      })
      .catch((err) => {
        console.error('Auth check failed:', err);
        dispatch(setIsLoading(false)); // ✅ Even on error, stop loading
      });
  }, [dispatch]);

  return null;
};

export default AuthInit;
