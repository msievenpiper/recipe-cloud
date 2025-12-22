"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold">
          Recipe Cloud
        </Link>
        <div className="space-x-4">
          {session ? (
            <>
              <Link href="/recipes" className="text-gray-300 hover:text-white">
                My Recipes
              </Link>
              <Link href="/upload" className="text-gray-300 hover:text-white">
                Upload
              </Link>
              <button
                onClick={() => signOut()}
                className="text-gray-300 hover:text-white"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/register" className="text-gray-300 hover:text-white">
                Register
              </Link>
              <button
                onClick={() => signIn()}
                className="text-gray-300 hover:text-white"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
