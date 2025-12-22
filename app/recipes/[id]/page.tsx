"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Recipe {
  id: number;
  title: string;
  content: string;
}

export default function RecipeDetailPage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    if (id) {
      fetch(`/api/recipes/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setRecipe(data);
          setContent(data.content);
        });
    }
  }, [id]);

  const handleSave = async () => {
    if (!recipe) return;

    await fetch(`/api/recipes/${recipe.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    setRecipe({ ...recipe, content });
    setIsEditing(false);
  };

  if (!recipe) {
    return <div className="text-center px-4 py-8 md:p-10 text-primary-700">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:p-8 bg-white rounded-lg shadow-md mt-8 mb-8">
      {isEditing ? (
        <div className="w-full">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-screen p-4 border border-gray-300 rounded-lg font-mono focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="mt-4 space-x-2">
            <button
              onClick={handleSave}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <article className="prose prose-base"> {/* Changed lg:prose-xl max-w-none to prose-base */}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{recipe.content}</ReactMarkdown>
          </article>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg mt-8 transition-colors duration-200"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
