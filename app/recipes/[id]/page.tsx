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

// Import the new IconPicker component
import IconPicker from "@/components/IconPicker";

// Import EasyMDE for its Options type
import EasyMDE from 'easymde';

// Import for PDF generation
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'; // jsPDF's html method requires html2canvas

interface Recipe {
  id: number;
  title: string;
  content: string;
  summary: string; // Added summary
  icon: string;    // Added icon
}

export default function RecipeDetailPage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState(""); // New state for summary
  const [icon, setIcon] = useState("");       // New state for icon
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    if (id) {
      fetch(`/api/recipes/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setRecipe(data);
          setContent(data.content);
          setSummary(data.summary || ""); // Initialize summary
          setIcon(data.icon || "");       // Initialize icon
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
      body: JSON.stringify({ content, summary, icon }), // Include summary and icon
    });

    setRecipe({ ...recipe, content, summary, icon }); // Update local state
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
        html2canvas: {
          useCORS: true,
        },
      });
    }
  };

  // Options for SimpleMDE editor
  const editorOptions: EasyMDE.Options = useMemo(() => { // Explicitly type as EasyMDE.Options
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
        "fullscreen",
        "guide",
      ],
      previewRender(plainText: string) {
        const processedContent = unified()
          .use(remarkParse)
          .use(remarkGfm)
          .use(remarkRehype)
          .use(rehypeStringify)
          .processSync(plainText)
          .toString();

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
        <div className="w-full flex flex-col min-h-[calc(100vh-150px)]">
          {/* Summary Input */}
          <div className="mb-4">
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
              Summary
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="A brief summary of the recipe..."
            ></textarea>
          </div>

          {/* Icon Picker */}
          <div className="mb-4">
            <IconPicker value={icon} onChange={setIcon} />
          </div>

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
          {/* Flex container for icon, title, and edit button */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center"> {/* Container for icon and title */}
              {recipe.icon && <span className="text-4xl mr-2">{recipe.icon}</span>}
              <h1 className="text-3xl font-bold text-gray-800">{recipe.title}</h1>
            </div>
            <div className="flex space-x-2"> {/* Container for buttons */}
              <button
                onClick={handlePrintToPdf}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Print to PDF
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Edit
              </button>
            </div>
          </div>

          {recipe.summary && <p className="text-lg text-gray-600 mb-4">{recipe.summary}</p>}
          <article id="recipe-content" className="prose prose-base"> {/* Added id for html2canvas */}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{recipe.content}</ReactMarkdown>
          </article>
        </div>
      )}
    </div>
  );
}
