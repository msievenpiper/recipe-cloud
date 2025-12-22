"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Import the SimpleMDE editor and its styles
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

// Import unified and related plugins for custom preview rendering
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

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

  // Options for SimpleMDE editor
  const editorOptions = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false,
      fixedToolbar: true, // Make the toolbar sticky
      toolbar: [ // Custom toolbar with individual heading buttons
        "bold",
        "italic",
        "strikethrough",
        "|",
        "heading-1", // Replaced heading-select with individual headings
        "heading-2",
        "heading-3",
        "|",
        "quote",
        "code",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        "|",
        // Removed "preview" button
        "fullscreen",
        "guide",
      ],
      previewRender(plainText: string) {
        // Use unified to parse markdown and convert to HTML, applying remarkGfm
        const processedContent = unified()
          .use(remarkParse)
          .use(remarkGfm) // Ensure GitHub Flavored Markdown is processed
          .use(remarkRehype)
          .use(rehypeStringify)
          .processSync(plainText)
          .toString();

        // Wrap the processed HTML in a div with your desired Tailwind prose classes
        return `<div class="prose prose-base">${processedContent}</div>`;
      },
    };
  }, []);

  if (!recipe) {
    return <div className="text-center px-4 py-8 md:p-10 text-primary-700">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:p-8 bg-white rounded-lg shadow-md mt-8 mb-8">
      {isEditing ? (
        <div className="w-full flex flex-col h-[calc(100vh-150px)]">
          <SimpleMdeReact
            value={content}
            onChange={setContent}
            options={editorOptions}
            className="w-full flex-1"
          />
          <div className="mt-4 space-x-2 flex-shrink-0">
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
        <div className="relative">
          <article className="prose prose-base">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{recipe.content}</ReactMarkdown>
          </article>
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
