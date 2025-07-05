"use client";

import { useState } from "react";
import RegistrationForm from "./components/registrationForm";
import DOBForm from "./components/DOBform";
import OTPForm from "./components/OTPform";
import { useRouter } from "next/navigation";

export interface UserData {
  email: string;
  password: string;
  fullName: string;
  username: string;
  date_of_birth?: string;
  auth_source: string;
}

export default function EmailSignup() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [userData, setUserData] = useState<UserData>({
    email: "",
    password: "",
    fullName: "",
    username: "",
    auth_source: "email",
  });

  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      {step === 1 && (
        <RegistrationForm
          data={userData}
          setData={setUserData}
          onSuccess={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <DOBForm
          data={userData}
          setData={setUserData}
          onSuccess={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <OTPForm
          data={userData}
          onSuccess={() => router.push("/")}
        />
      )}
    </div>
  );
}
