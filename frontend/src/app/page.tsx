"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import Login from "./login";
import Homepage from "./homepage";
import LoadingHomepage from "@/components/self/loadinghomepage";
import MainLayout from "@/components/self/mainlayout";
import { useSelector } from "react-redux";

export default function Start() {
  
  const isLoading = useSelector((state: any) => state.auth.isLoading);
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);

  console.log('isLoading', isLoading);

  return (
    <div>
      {isLoading ? <LoadingHomepage/> : isLoggedIn ? <MainLayout><Homepage/></MainLayout> : <Login />}
    </div>
  );
}
