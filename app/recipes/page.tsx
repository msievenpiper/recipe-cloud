"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { FaBookOpen, FaSearch } from "react-icons/fa";

interface Recipe {
  id: number;
  title: string;
  summary?: string;
}

export default function RecipeListPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/recipes")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  const suggestions = useMemo(() => {
    if (!searchTerm) return [];
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return recipes
      .filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(lowercasedSearchTerm) ||
          (recipe.summary && recipe.summary.toLowerCase().includes(lowercasedSearchTerm))
      )
      .slice(0, 5); // Limit to 5 suggestions
  }, [recipes, searchTerm]);

  const filteredRecipes = useMemo(() => {
    if (!searchTerm) {
      return recipes;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(lowercasedSearchTerm) ||
        (recipe.summary && recipe.summary.toLowerCase().includes(lowercasedSearchTerm))
    );
  }, [recipes, searchTerm]);

  const handleSelectSuggestion = (title: string) => {
    setSearchTerm(title);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 md:p-24">
        <h1 className="text-4xl font-bold text-primary-700">Loading your recipes...</h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-8 md:p-24 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-primary-800">Your Recipes</h1>

      {recipes.length > 0 && (
        <div className="w-full max-w-2xl mb-8 relative" ref={searchInputRef}>
          <input
            type="text"
            placeholder="Search your recipes..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((recipe) => (
                <li
                  key={recipe.id}
                  className="p-3 hover:bg-primary-50 cursor-pointer border-b border-gray-200 last:border-b-0"
                  onClick={() => handleSelectSuggestion(recipe.title)}
                >
                  {recipe.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {filteredRecipes.length > 0 ? (
        <ul className="w-full max-w-2xl">
          {filteredRecipes.map((recipe) => (
            <li key={recipe.id} className="mb-4 p-4 border border-gray-200 rounded-lg shadow-sm flex items-center space-x-4 bg-white hover:shadow-md transition-shadow duration-200">
              <FaBookOpen className="text-primary-500 text-3xl w-6 h-6 flex-shrink-0" />
              <div>
                <Link href={`/recipes/${recipe.id}`} className="text-xl font-semibold text-primary-700 hover:text-primary-900 hover:underline">
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
        <div className="text-center bg-white p-6 md:p-10 rounded-lg shadow-md mx-4 border border-gray-200">
          {recipes.length > 0 && searchTerm ? (
            <>
              <h2 className="text-2xl font-bold mb-4 text-primary-800">No Recipes Found</h2>
              <p className="mb-6 text-gray-700">Your search for &quot;{searchTerm}&quot; did not match any recipes.</p>
              <button
                onClick={() => setSearchTerm("")}
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Clear Search
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4 text-primary-800">Welcome to Your Recipe Collection!</h2>
              <p className="mb-6 text-gray-700">It looks like you don't have any recipes yet. Let's create your first one.</p>
              <div className="text-left mb-6 text-gray-700">
                <h3 className="text-xl font-semibold mb-2">How to Upload Your First Recipe:</h3>
                <ol className="list-decimal list-inside space-y-2 pl-5">
                  <li>Click the "Upload" button below or in the navigation bar.</li>
                  <li>Choose a clear photo of your recipe.</li>
                  <li>Our AI will work its magic to extract the details.</li>
                  <li>Review, edit, and save your new digital recipe!</li>
                </ol>
              </div>
              <Link href="/upload" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200">
                Upload Your First Recipe
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
