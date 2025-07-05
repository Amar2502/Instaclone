"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import Login from "./login"; // ✅ Capitalized
import Homepage from "./homepage";
import LoadingHomepage from "@/components/self/loadinghomepage";
import MainLayout from "@/components/self/mainlayout";

export default function Start() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        await axios.get("http://localhost:8080/users/isauth", {
          withCredentials: true,
        });
        setLoggedIn(true);
        setIsLoading(false);
      } catch (error) {
        setLoggedIn(false);
        setIsLoading(false);
      }
    };

    checkLogin();
  }, []);

  return (
    <div>
      {isLoading ? <LoadingHomepage/> : loggedIn ? <MainLayout><Homepage/></MainLayout> : <Login />}
    </div>
  );
}
