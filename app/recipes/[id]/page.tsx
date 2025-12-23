"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import IconPicker from "@/components/IconPicker";
import ShareModal from "@/components/ShareModal";
import EasyMDE from 'easymde';
import jsPDF from 'jspdf';

interface Recipe {
  id: number;
  title: string;
  content: string;
  summary: string;
  icon: string;
  authorId: string;
}

export default function RecipeDetailPage() {
  const { data: session } = useSession();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [icon, setIcon] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    if (id) {
      fetch(`/api/recipes/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch recipe");
          }
          return res.json();
        })
        .then((data) => {
          setRecipe(data);
          setContent(data.content);
          setSummary(data.summary || "");
          setIcon(data.icon || "");
        })
        .catch(error => {
          console.error("Error fetching recipe:", error);
        });
    }
  }, [id]);

  const isAuthor = session?.user?.id === recipe?.authorId;

  const handleSave = async () => {
    if (!recipe) return;
    await fetch(`/api/recipes/${recipe.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, summary, icon }),
    });
    setRecipe({ ...recipe, content, summary, icon });
    setIsEditing(false);
  };

  const handlePrintToPdf = async () => {
    const input = document.getElementById('recipe-content');
    if (input && recipe) {
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.html(input, {
        callback: function(doc) {
          const totalPages = doc.getNumberOfPages();
          for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            const footerText = `Recipe Cloud - Page ${i} of ${totalPages}`;
            const textWidth = doc.getStringUnitWidth(footerText) * doc.getFontSize() / doc.internal.scaleFactor;
            const textX = (doc.internal.pageSize.getWidth() - textWidth) / 2;
            doc.text(footerText, textX, doc.internal.pageSize.getHeight() - 8);
          }
          doc.save(`${recipe.title}.pdf`);
        },
        margin: [15, 15, 20, 15],
        autoPaging: 'slice',
        width: 180,
        windowWidth: 650,
      });
    }
  };

  const editorOptions: EasyMDE.Options = useMemo(() => ({
    autofocus: true,
    spellChecker: false,
    fixedToolbar: true,
    toolbar: ["bold", "italic", "strikethrough", "|", "heading-1", "heading-2", "heading-3", "|", "quote", "code", "unordered-list", "ordered-list", "|", "link", "image", "|", "fullscreen", "guide"],
    previewRender(plainText: string) {
      const processedContent = unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeStringify).processSync(plainText).toString();
      return `<div class="prose prose-base">${processedContent}</div>`;
    },
  }), []);

  if (!recipe) {
    return <div className="text-center px-4 py-8 md:p-10 text-primary-700">Loading...</div>;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 md:p-8 bg-white rounded-lg shadow-md mt-8 mb-8">
        {isEditing ? (
          <div className="w-full flex flex-col min-h-[calc(100vh-150px)]">
            <div className="mb-4">
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Summary</label>
              <textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" placeholder="A brief summary of the recipe..."></textarea>
            </div>
            <div className="mb-4">
              <IconPicker value={icon} onChange={setIcon} />
            </div>
            <SimpleMdeReact value={content} onChange={setContent} options={editorOptions} className="w-full flex-1" />
            <div className="mt-4 space-x-2 flex-shrink-0">
              <button onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">Save</button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div className="flex items-center mb-4 md:mb-0">
                {recipe.icon && <span className="text-4xl mr-2">{recipe.icon}</span>}
                <h1 className="text-3xl font-bold text-gray-800">{recipe.title}</h1>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={handlePrintToPdf} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">Print to PDF</button>
                {isAuthor && (
                  <>
                    <button onClick={() => setShowShareModal(true)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">Share</button>
                    <button onClick={() => setIsEditing(true)} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">Edit</button>
                  </>
                )}
              </div>
            </div>
            {recipe.summary && <p className="text-lg text-gray-600 mb-4">{recipe.summary}</p>}
            <article id="recipe-content" className="prose prose-base">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{recipe.content}</ReactMarkdown>
            </article>
          </div>
        )}
      </div>
      {showShareModal && recipe && <ShareModal recipeId={recipe.id} onClose={() => setShowShareModal(false)} />}
    </>
  );
}
