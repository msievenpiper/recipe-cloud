"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";

interface RecipeSummary {
    id: number;
    title: string;
    createdAt: string;
    icon: string;
}

export default function AdminUserRecipesPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;
    const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userId) {
            fetch(`/api/admin/users/${userId}/recipes`)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch");
                    return res.json();
                })
                .then(data => setRecipes(data))
                .catch(err => setError("Failed to load recipes"))
                .finally(() => setLoading(false));
        }
    }, [userId]);

    if (loading) return <div className="p-8 text-center"><FaSpinner className="animate-spin text-4xl mx-auto" /></div>;
    if (error) return (
        <div className="p-8">
            <Link href="/admin/users" className="flex items-center text-primary-600 mb-4 hover:underline"><FaArrowLeft className="mr-2" /> Back to Users</Link>
            <div className="text-center text-red-600 font-bold">{error}</div>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/admin/users" className="flex items-center text-primary-600 mb-6 hover:underline"><FaArrowLeft className="mr-2" /> Back to Users</Link>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">User Recipes</h1>

                {recipes.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                        No recipes found for this user.
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {recipes.map((recipe) => (
                                <li key={recipe.id}>
                                    <Link href={`/recipes/${recipe.id}`} className="block hover:bg-gray-50">
                                        <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                            <div className="flex items-center">
                                                <span className="text-2xl mr-3">{recipe.icon || '📄'}</span>
                                                <div className="text-sm font-medium text-primary-600 truncate">{recipe.title}</div>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(recipe.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
