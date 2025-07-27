"use client";

import { useSelector } from "react-redux";
import LoadingHomepage from "@/components/self/loadinghomepage";
import Chat from "./chat";
import { useParams } from "next/navigation";
import MessageLayout from "@/components/self/messagelayout";

export default function Start() {

  const isLoading = useSelector((state: any) => state.auth.isLoading);

  const { user_id } = useParams<{ user_id: string }>();

  if (isLoading) {
    return <LoadingHomepage />;
  }

  return (
    <MessageLayout >
      <Chat user_id={Number(user_id)} />
    </MessageLayout>
  );
}   