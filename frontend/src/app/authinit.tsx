  // app/AuthInit.tsx
  'use client';

  import { useEffect } from 'react';
  import axios from 'axios';
  import { useDispatch } from 'react-redux';
  import { setIsLoading, setUserInfo } from './redux/slices/authslice';

  const AuthInit = () => {

    console.log('AuthInit');
    
    const dispatch = useDispatch();

    useEffect(() => {
      axios.get('http://localhost:8080/users/isauth', { withCredentials: true })
        .then((res) => {
          if (res.data.loggedIn) {
            console.log(res.data);
            dispatch(setUserInfo({ username: res.data.username, isLoggedIn: true, user_id: res.data.user_id }));
            console.log('User info set');
          }
          else {
            console.log('User info not set');
          }
        })
        .catch((err) => {
          console.error('Auth check failed:', err);
          console.log('User info not set');
        });
    }, []);

    return null; // no UI needed
  };

  export default AuthInit;
