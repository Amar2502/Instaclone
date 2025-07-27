"use client";

import MainLayout from "@/components/self/mainlayout";
import { useSelector } from "react-redux";
import LoadingHomepage from "@/components/self/loadinghomepage";
import Chat from "./chat";
import { useParams } from "next/navigation";

export default function Start() {

  const isLoading = useSelector((state: any) => state.auth.isLoading);

  const { user_id } = useParams();

  if (isLoading) {
    return <LoadingHomepage />;
  }

  return (
    <MainLayout >
      <Chat user_id={user_id as string} />
    </MainLayout>
  );
}   