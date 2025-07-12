"use client";

import MainLayout from "@/components/self/mainlayout";
import { useSelector } from "react-redux";
import LoadingHomepage from "@/components/self/loadinghomepage";
import Explore from "./explore";

export default function Start() {

  const isLoading = useSelector((state: any) => state.auth.isLoading);

  if (isLoading) {
    return <LoadingHomepage />;
  }

  return (
    <MainLayout >
      <Explore/>
    </MainLayout>
  );
}