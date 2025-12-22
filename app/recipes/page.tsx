"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBookOpen } from "react-icons/fa"; // Placeholder icon

interface Recipe {
  id: number;
  title: string;
  summary?: string; // Summary is now optional
}

export default function RecipeListPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/recipes")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold">Loading your recipes...</h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Your Recipes</h1>
      {recipes.length > 0 ? (
        <ul className="w-full max-w-2xl">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="mb-4 p-4 border rounded-lg shadow-sm flex items-start space-x-4">
              <FaBookOpen className="text-blue-500 text-3xl mt-1" />
              <div>
                <Link href={`/recipes/${recipe.id}`} className="text-2xl font-semibold text-blue-600 hover:underline">
                  {recipe.title}
                </Link>
                {recipe.summary && (
                  <p className="text-gray-600 text-sm mt-1">{recipe.summary}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center bg-gray-100 p-10 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Welcome to Your Recipe Collection!</h2>
          <p className="mb-6">It looks like you don't have any recipes yet. Let's create your first one.</p>
          <div className="text-left mb-6">
            <h3 className="text-xl font-semibold mb-2">How to Upload Your First Recipe:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Click the "Upload" button below or in the navigation bar.</li>
              <li>Choose a clear photo of your recipe.</li>
              <li>Our AI will work its magic to extract the details.</li>
              <li>Review, edit, and save your new digital recipe!</li>
            </ol>
          </div>
          <Link href="/upload" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg">
            Upload Your First Recipe
          </Link>
        </div>
      )}
    </div>
  );
}
