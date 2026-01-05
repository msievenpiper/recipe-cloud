"use client";

import { useState, useEffect } from "react";
import { FaCrown, FaUserShield, FaSpinner, FaCheck, FaTimes } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface User {
    id: string;
    name: string | null;
    email: string;
    role: string;
    isPremium: boolean;
    scanCount: number;
    lastScanDate: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const { update } = useSession();

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (res.status === 403) {
                setError("Access Denied: You must be an admin to view this page.");
                setLoading(false);
                return;
            }
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    const updatedUser = async (id: string, updates: Partial<User>) => {
        try {
            const res = await fetch("/api/admin/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, ...updates }),
            });
            if (res.ok) {
                // Refresh list or update local state
                setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
            } else {
                alert("Failed to update user");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating user");
        }
    };

    const impersonateUser = async (userId: string) => {
        if (!confirm("Are you sure you want to login as this user? You can return to your admin account later.")) return;

        await update({ impersonateUserId: userId });
        window.location.href = "/"; // Redirect to home as the new user
    };

    if (loading) return <div className="p-8 text-center"><FaSpinner className="animate-spin text-4xl mx-auto" /></div>;
    if (error) return <div className="p-8 text-center text-red-600 font-bold">{error}</div>;

    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{user.name || "No Name"}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.isPremium ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                <FaCrown className="mr-1 mt-0.5" /> Premium
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Free
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.scanCount} scans
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => updatedUser(user.id, { isPremium: !user.isPremium })}
                                            className={`text-indigo-600 hover:text-indigo-900 ${user.isPremium ? 'text-red-600 hover:text-red-900' : ''}`}
                                        >
                                            {user.isPremium ? "Revoke Premium" : "Gift Premium"}
                                        </button>
                                        <span className="text-gray-300">|</span>
                                        <button
                                            onClick={() => updatedUser(user.id, { role: user.role === 'ADMIN' ? 'USER' : 'ADMIN' })}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            {user.role === 'ADMIN' ? "Remove Admin" : "Make Admin"}
                                        </button>
                                        <span className="text-gray-300">|</span>
                                        <Link href={`/admin/users/${user.id}/recipes`} className="text-blue-600 hover:text-blue-900">
                                            View Recipes
                                        </Link>
                                        <span className="text-gray-300">|</span>
                                        <button
                                            onClick={() => impersonateUser(user.id)}
                                            className="text-orange-600 hover:text-orange-900 font-bold"
                                        >
                                            Login as User
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
