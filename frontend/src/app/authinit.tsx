'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setIsLoading, setUserInfo } from './redux/slices/authslice';

const AuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setIsLoading(true));

    axios.get('http://localhost:8080/users/isauth', { withCredentials: true })
      .then((res) => {
        if (res.data.loggedIn) {
          dispatch(setUserInfo({ username: res.data.username, isLoggedIn: true, user_id: res.data.user_id, profile_pic: res.data.profile_picture }));
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
