"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { FaBookOpen, FaSearch, FaPlus } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface Recipe {
  id: number;
  title: string;
  summary?: string;
  icon?: string;
  author?: {
    name?: string | null;
    email: string;
  };
}

export default function RecipeListPage() {
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [sharedRecipes, setSharedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('Recipes.List');

  useEffect(() => {
    Promise.all([
      fetch("/api/recipes").then((res) => res.json()),
      fetch("/api/shared-recipes").then((res) => res.json()),
    ]).then(([myRecipesData, sharedRecipesData]) => {
      setMyRecipes(myRecipesData);
      setSharedRecipes(sharedRecipesData);
      setLoading(false);
    });
  }, []);

  const allRecipes = useMemo(() => [...myRecipes, ...sharedRecipes], [myRecipes, sharedRecipes]);

  const suggestions = useMemo(() => {
    if (!searchTerm) return [];
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return allRecipes
      .filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(lowercasedSearchTerm) ||
          (recipe.summary && recipe.summary.toLowerCase().includes(lowercasedSearchTerm))
      )
      .slice(0, 5);
  }, [allRecipes, searchTerm]);

  const filteredMyRecipes = useMemo(() => {
    if (!searchTerm) return myRecipes;
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return myRecipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(lowercasedSearchTerm) ||
        (recipe.summary && recipe.summary.toLowerCase().includes(lowercasedSearchTerm))
    );
  }, [myRecipes, searchTerm]);

  const filteredSharedRecipes = useMemo(() => {
    if (!searchTerm) return sharedRecipes;
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return sharedRecipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(lowercasedSearchTerm) ||
        (recipe.summary && recipe.summary.toLowerCase().includes(lowercasedSearchTerm))
    );
  }, [sharedRecipes, searchTerm]);

  const handleSelectSuggestion = (title: string) => {
    setSearchTerm(title);
    setShowSuggestions(false);
  };

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
        <h1 className="text-4xl font-bold text-primary-700">{t('loading')}</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4 py-8 md:p-24 bg-gray-50">
      <div className="w-full max-w-2xl flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary-800">{t('title')}</h1>
        <Link href="/upload" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200">
          <FaPlus />
          <span>{t('addNew')}</span>
        </Link>
      </div>

      {allRecipes.length > 0 && (
        <div className="w-full max-w-2xl mb-8 relative" ref={searchInputRef}>
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
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
                <li key={recipe.id} className="p-3 hover:bg-primary-50 cursor-pointer border-b border-gray-200 last:border-b-0" onClick={() => handleSelectSuggestion(recipe.title)}>
                  {recipe.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {filteredMyRecipes.length > 0 && (
        <div className="w-full max-w-2xl mb-8">
          <h2 className="text-2xl font-bold text-primary-800 mb-4">{t('myRecipes')}</h2>
          <ul className="w-full">
            {filteredMyRecipes.map((recipe) => (
              <li key={recipe.id} className="mb-4 p-4 border border-gray-200 rounded-lg shadow-sm flex items-center space-x-4 bg-white hover:shadow-md transition-shadow duration-200">
                {recipe.icon ? <span className="text-3xl flex-shrink-0">{recipe.icon}</span> : <FaBookOpen className="text-primary-500 text-3xl w-6 h-6 flex-shrink-0" />}
                <div>
                  <Link href={`/recipes/${recipe.id}`} className="text-xl font-semibold text-primary-700 hover:text-primary-900 hover:underline">
                    {recipe.title}
                  </Link>
                  {recipe.summary && <p className="text-gray-600 text-sm mt-1">{recipe.summary}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {filteredSharedRecipes.length > 0 && (
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-primary-800 mb-4">{t('sharedWithYou')}</h2>
          <ul className="w-full">
            {filteredSharedRecipes.map((recipe) => (
              <li key={recipe.id} className="mb-4 p-4 border border-gray-200 rounded-lg shadow-sm flex items-center space-x-4 bg-white hover:shadow-md transition-shadow duration-200">
                {recipe.icon ? <span className="text-3xl flex-shrink-0">{recipe.icon}</span> : <FaBookOpen className="text-primary-500 text-3xl w-6 h-6 flex-shrink-0" />}
                <div>
                  <Link href={`/recipes/${recipe.id}`} className="text-xl font-semibold text-primary-700 hover:text-primary-900 hover:underline">
                    {recipe.title}
                  </Link>
                  <p className="text-gray-500 text-xs mt-1">{t('sharedBy')} {recipe.author?.name || recipe.author?.email}</p>
                  {recipe.summary && <p className="text-gray-600 text-sm mt-1">{recipe.summary}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {allRecipes.length === 0 && (
        <div className="text-center bg-white p-6 md:p-10 rounded-lg shadow-md mx-4 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-primary-800">{t('welcomeTitle')}</h2>
          <p className="mb-6 text-gray-700">{t('welcomeDesc')}</p>
          <Link href="/upload" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200">
            {t('uploadFirst')}
          </Link>
        </div>
      )}
    </div>
  );
}
