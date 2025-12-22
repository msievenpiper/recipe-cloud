"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push("/");
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Login</h1>
      <div className="flex flex-col space-y-4">
        <button
          onClick={() => signIn("google")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign in with Google
        </button>
        <button
          onClick={() => signIn("facebook")}
          className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
        >
          Sign in with Facebook
        </button>
        <button
          onClick={() => signIn("twitter")}
          className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign in with Twitter
        </button>
      </div>
    </div>
  );
}
