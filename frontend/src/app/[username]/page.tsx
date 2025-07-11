"use client";

import MainLayout from "@/components/self/mainlayout";
import Profile from "./profile";
import { useSelector } from "react-redux";
import LoadingHomepage from "@/components/self/loadinghomepage";

export default function Start() {

  const isLoading = useSelector((state: any) => state.auth.isLoading);

  if (isLoading) {
    return <LoadingHomepage />;
  }

  return (
    <MainLayout >
      <Profile/>
    </MainLayout>
  );
}