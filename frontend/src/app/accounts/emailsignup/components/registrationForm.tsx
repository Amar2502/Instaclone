"use client";

import Image from "next/image";
import { Eye, EyeOff, Facebook } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import FloatingInput from "@/components/self/floatingInput";
import { z } from "zod";
import { UserData } from "../page";

interface Error {
    message: string;
    problem: string;
}

interface RegisterProps {
    data: UserData;
    setData: React.Dispatch<React.SetStateAction<UserData>>;
    onSuccess: () => void;
}

const registerSchema = z.object({
    email: z
        .string()
        .min(5, "Email is too short")
        .refine(
            (val) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            {
                message: "Must be a valid email or phone number",
            }
        ),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(12, "Password must be no more than 12 characters"),
    fullName: z.string().min(1, "Full name is required"),
    username: z.string().min(1, "Username is required"),
    auth_source: z.string(),
    date_of_birth: z.string().optional(),
});

export default function RegistrationForm({ data, setData, onSuccess }: RegisterProps) {
    const [show, setShow] = useState(false);

    const [error, setError] = useState<Error | null>(null);

    const [formErrors, setFormErrors] = useState<Partial<Record<keyof UserData, string>>>({});


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        console.log("handleSubmit");
        e.preventDefault();
        setFormErrors({}); // reset

        const result = registerSchema.safeParse(data);
        console.log(result);

        if (!result.success) {
            const fieldErrors: Partial<Record<keyof UserData, string>> = {};
            result.error.errors.forEach((err) => {
                const field = err.path[0] as keyof UserData;
                fieldErrors[field] = err.message;
            });
            setFormErrors(fieldErrors);
            return; // don't submit if validation fails
        }

        console.log(data);

        try {
            console.log("try");
            
            onSuccess();
        } catch (err) {
            console.error("Submission error:", err);
        }

    };


    return (
        <div className="w-full max-w-sm">
            <div className="border border-zinc-800 rounded-sm p-8 flex flex-col items-center gap-4 mt-5">
                <Image
                    src="/instagram-wordmark.svg"
                    alt="Instagram"
                    width={180}
                    height={40}
                    className="mb-2"
                />
                <p className="text-sm text-zinc-400 text-center">
                    Sign up to see photos and videos from your friends.
                </p>

                <button className="bg-blue-500 cursor-pointer hover:bg-blue-600 w-full py-2 rounded-md flex items-center justify-center gap-2 text-sm font-medium text-white">
                    <Facebook className="h-4 w-4" />
                    Log in with Facebook
                </button>

                <div className="relative w-full my-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-zinc-700" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-zinc-900 px-2 text-zinc-400">OR</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
                    <FloatingInput
                        name="email"
                        label="Email address"
                        value={data.email}
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
                        value={data.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                    >
                        <div onClick={() => setShow(!show)}>
                            {show ? <EyeOff size={16} /> : <Eye size={16} />}
                        </div>
                    </FloatingInput>
                    {formErrors.password && <p className="text-red-500 text-sm pl-1">{formErrors.password}</p>}

                    <FloatingInput
                        name="fullName"
                        label="Full Name"
                        value={data.fullName}
                        onChange={handleChange}
                        required
                    />
                    {formErrors.fullName && <p className="text-red-500 text-sm pl-1">{formErrors.fullName}</p>}

                    <FloatingInput
                        name="username"
                        label="Username"
                        value={data.username}
                        onChange={handleChange}
                        required
                    />
                    {formErrors.username && <p className="text-red-500 text-sm pl-1">{formErrors.username}</p>}
                    {error && error.problem === "username" && (
                        <p className="text-red-500 text-sm pl-1">{error.message}</p>
                    )}

                    <p className="text-[11px] text-zinc-400 text-center mt-2">
                        People who use our service may have uploaded your contact information to Instagram.{" "}
                        <Link href="/" className="text-blue-400">Learn more</Link>
                    </p>

                    <p className="text-[11px] text-zinc-400 text-center">
                        By signing up, you agree to our{" "}
                        <Link href="/" className="text-blue-400">Terms</Link>,{" "}
                        <Link href="/" className="text-blue-400">Privacy Policy</Link>, and{" "}
                        <Link href="/" className="text-blue-400">Cookies Policy</Link>.
                    </p>

                    <button
                        type="submit"
                        disabled={
                            !data.email || !data.password || !data.fullName || !data.username
                        }
                        className={`w-full text-white text-sm font-semibold py-2 rounded-md mt-2 cursor-pointer 
    ${(!data.email || !data.password || !data.fullName || !data.username)
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        Sign Up
                    </button>

                </form>
            </div>
            <div className=" border border-zinc-800 rounded-sm text-center py-4 mt-3 text-sm">
                Have an account?{" "}
                <Link href="/" className="text-blue-400 font-medium">Log in</Link>
            </div>
        </div>
    );
}