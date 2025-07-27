"use client";

import { useSelector } from "react-redux";
import LoadingHomepage from "@/components/self/loadinghomepage";
import Inbox from "./inbox";
import MessageLayout from "@/components/self/messagelayout";

export default function Start() {

  const isLoading = useSelector((state: any) => state.auth.isLoading);

  if (isLoading) {
    return <LoadingHomepage />;
  }

  return (
    <MessageLayout >
      <Inbox />
    </MessageLayout>
  );
}   