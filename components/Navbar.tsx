"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const NavLinks = () => (
    <>
      {session ? (
        <>
          <Link href="/recipes" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium" onClick={toggleMenu}>
            My Recipes
          </Link>
          <Link href="/upload" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium" onClick={toggleMenu}>
            Upload
          </Link>
          <Link href="/profile" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium" onClick={toggleMenu}>
            Profile
          </Link>
          {session.user?.role === 'ADMIN' && (
            <div className="relative group inline-block">
              <button className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none flex items-center">
                Admin <FaBars className="ml-1 text-xs" />
              </button>
              {/* Dropdown with pt-2 to bridge the hover gap */}
              <div className="absolute left-0 pt-2 w-48 hidden group-hover:block z-20">
                <div className="bg-white rounded-md shadow-lg py-1 text-gray-800">
                  <Link href="/admin/users" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={toggleMenu}>
                    Manage Users
                  </Link>
                </div>
              </div>
            </div>
          )}
          {/* Mobile Admin Link (simpler for mobile menu) */}
          <div className="md:hidden">
            {session.user?.role === 'ADMIN' && (
              <Link href="/admin/users" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium block" onClick={toggleMenu}>
                Admin Dashboard
              </Link>
            )}
          </div>

          <button
            onClick={() => { signOut(); toggleMenu(); }}
            className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <Link href="/register" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium" onClick={toggleMenu}>
            Register
          </Link>
          <button
            onClick={() => { signIn(); toggleMenu(); }}
            className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Sign In
          </button>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-primary-700 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold flex items-center space-x-2" onClick={() => setIsOpen(false)}>
          <Image src="/icon.svg" alt="Recipe Cloud Icon" width={24} height={24} />
          <span>Recipe Cloud</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          <NavLinks />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-primary-800 z-50 transform ${isOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <FaTimes size={24} />
          </button>
        </div>
        <div className="flex flex-col items-start space-y-4 p-4">
          <NavLinks />
        </div>
      </div>
    </nav>
  );
}
