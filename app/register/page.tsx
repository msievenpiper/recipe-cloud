"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import InteractiveBackground from "@/components/InteractiveBackground";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const signInResponse = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResponse?.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError(signInResponse?.error || "Sign-in failed after registration.");
      }
    } else {
      const errorData = await res.json();
      setError(errorData.message || "Registration failed.");
    }
  };

  return (
    <>
      <InteractiveBackground />
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 md:p-24">
        <div className="w-full max-w-md p-6 md:p-8 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
          <h1 className="text-3xl font-bold mb-6 text-center text-primary-800">Register</h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200"
            >
              Register
            </button>
          </form>
          <p className="mt-6 text-center text-gray-700">
            Already have an account?{" "}
            <Link href="/api/auth/signin" className="text-primary-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
