"use client";

import Image from "next/image";
import { Eye, EyeOff, FacebookIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import {z} from "zod";
import FloatingInput from "@/components/self/floatingInput";
import axios from "axios";
import { useRouter } from "next/navigation";

interface login {
  email: string;
  password: string;
}

interface Error {
  message: string;
  problem: string;
}

const loginSchema = z.object({
  email: z
    .string()
    .refine(
      (val) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      { message: "Enter a valid email" }
    ),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Password must be alphanumeric (A–Z, a–z, 0–9)"),
});

export default function login() {
  const [show, setShow] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [login, setLogin] = useState<login>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof login, string>>>({});

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const result = loginSchema.safeParse(login);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof login, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof login;
        fieldErrors[field] = err.message;
      });
      setFormErrors(fieldErrors);
      return; // don't submit if validation fails
    }
    else{
      setFormErrors({});
      console.log("Form submitted:", login);
    }
  
    console.log(result);
  };
  

  return (
    <div className="h-screen w-screen bg-black text-white flex justify-center items-center">
      <div className="flex gap-0 justify-center">
        {/* Image Header */}
        <div className="hidden lg:block">
          <Image src="/instaheader.png" alt="logo" width={700} height={700} />
        </div>
        <div className="ml-10 flex flex-col items-center mt-10">
          {/*Image Text*/}
          <div className="mb-6">
            <Image
              src="/instagram-wordmark.svg"
              alt="Instagram logo"
              width={200}
              height={200}
            />
          </div>

          {/*Login Form*/}
          <form className="flex flex-col gap-4 w-64" onSubmit={handleSubmit}>
          <FloatingInput
              name="email"
              label="Email address"
              value={login.email}
              onChange={handleChange}
              required
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm pl-1">{formErrors.email}</p>
            )}
            {error && error.problem === "email" && (
              <p className="text-red-500 text-sm pl-1">{error.message}</p>
            )}

            <FloatingInput
              name="password"
              label="Password"
              type={show ? "text" : "password"}
              value={login.password}
              onChange={handleChange}
              required
              minLength={6}
            >
              <div onClick={() => setShow(!show)}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </div>
            </FloatingInput>
            {formErrors.password && <p className="text-red-500 text-sm pl-1">{formErrors.password}</p>}
            {error && error.problem === "password" && (
              <p className="text-red-500 text-sm pl-1">{error.message}</p>
            )}

            <button
              type="submit"
              className="bg-blue-500 text-white py-1 rounded-lg hover:bg-blue-600 transition cursor-pointer"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-2 my-4">
            <div className="flex-grow h-px bg-zinc-700" />
            <span className="text-sm text-zinc-400">OR</span>
            <div className="flex-grow h-px bg-zinc-700" />
          </div>

          {/* Facebook Login */}
          <button className="text-blue-400 text-sm font-medium mb-3 cursor-pointer flex gap-1">
            <FacebookIcon />
            Log in with Facebook
          </button>

          {/* Forgot Password */}
          <div className="text-sm text-blue-50 hover:underline cursor-pointer text-center">
            Forgotten your password?
          </div>

          {/* Don't have account */}
          <div className="text-sm text-blue-50 text-center mt-5">
            Don't have an account?
            <Link
              href="/accounts/emailsignup"
              className="text-blue-400 cursor-pointer text-sm font-medium"
            >
              <span> Sign up</span>
            </Link>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="absolute bottom-4 w-full flex flex-col items-center text-zinc-500 text-xs">
        {/* Top Link Row */}
        <div className="flex flex-wrap justify-center gap-4 mb-5">
          <span className="hover:underline cursor-pointer">Meta</span>
          <span className="hover:underline cursor-pointer">About</span>
          <span className="hover:underline cursor-pointer">Blog</span>
          <span className="hover:underline cursor-pointer">Jobs</span>
          <span className="hover:underline cursor-pointer">Help</span>
          <span className="hover:underline cursor-pointer">API</span>
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span className="hover:underline cursor-pointer">Terms</span>
          <span className="hover:underline cursor-pointer">Locations</span>
          <span className="hover:underline cursor-pointer">Instagram Lite</span>
          <span className="hover:underline cursor-pointer">Threads</span>
          <span className="hover:underline cursor-pointer">
            Contact uploading and non-users
          </span>
          <span className="hover:underline cursor-pointer">Meta Verified</span>
        </div>

        {/* Language + Copyright */}
        <div className="flex gap-4">
          <span className="hover:underline cursor-pointer">English (UK)</span>
          <span>© 2025 Instagram from Meta</span>
        </div>
      </footer>
    </div>
  );
}
