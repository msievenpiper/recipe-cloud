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
import { useTranslations } from "next-intl";

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
  const [translatedRecipe, setTranslatedRecipe] = useState<{ title: string; content: string; summary: string } | null>(null);
  const [targetLang, setTargetLang] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const params = useParams();
  const id = params.id;
  const t = useTranslations('Recipes.Detail');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];

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

  const handleTranslate = async () => {
    if (!recipe) return;
    setIsTranslating(true);
    try {
      const res = await fetch(`/api/recipes/${id}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetLanguage: languages.find(l => l.code === targetLang)?.name }),
      });
      if (res.ok) {
        const data = await res.json();
        setTranslatedRecipe(data);
      }
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const currentTitle = translatedRecipe?.title || recipe?.title || "";
  const currentSummary = translatedRecipe?.summary || summary;
  const currentContent = translatedRecipe?.content || content;

  const handlePrintToPdf = async () => {
    const input = document.getElementById('recipe-content-wrapper');
    if (input && recipe) {
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.html(input, {
        callback: function (doc) {
          const totalPages = doc.getNumberOfPages();
          for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            const footerText = `${t('pdfFooter')} ${i} of ${totalPages}`;
            const textWidth = doc.getStringUnitWidth(footerText) * doc.getFontSize() / doc.internal.scaleFactor;
            const textX = (doc.internal.pageSize.getWidth() - textWidth) / 2;
            doc.text(footerText, textX, doc.internal.pageSize.getHeight() - 8);
          }
          doc.save(`${currentTitle}.pdf`);
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
    return <div className="text-center px-4 py-8 md:p-10 text-primary-700">{t('loading')}</div>;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 md:p-8 bg-white rounded-lg shadow-md mt-8 mb-8">
        {isEditing ? (
          <div className="w-full flex flex-col min-h-[calc(100vh-150px)]">
            <div className="mb-4">
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700">{t('summaryLabel')}</label>
              <textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" placeholder={t('summaryPlaceholder')}></textarea>
            </div>
            <div className="mb-4">
              <IconPicker value={icon} onChange={setIcon} />
            </div>
            <SimpleMdeReact value={content} onChange={setContent} options={editorOptions} className="w-full flex-1" />
            <div className="mt-4 space-x-2 flex-shrink-0">
              <button onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">{t('save')}</button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">{t('cancel')}</button>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Translation Header Bar */}
            <div className="mb-6 pb-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-500">{t('translate')}:</label>
                <div className="flex items-center gap-2">
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleTranslate}
                    disabled={isTranslating}
                    className="bg-primary-50 hover:bg-primary-100 text-primary-700 text-sm font-semibold py-1.5 px-4 rounded-md transition-all disabled:opacity-50"
                  >
                    {isTranslating ? t('translating') : t('translate')}
                  </button>
                </div>
              </div>
              {translatedRecipe && (
                <button
                  onClick={() => setTranslatedRecipe(null)}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  {t('original')}
                </button>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div className="flex items-center mb-4 md:mb-0">
                {recipe.icon && <span className="text-4xl mr-2">{recipe.icon}</span>}
                <h1 className="text-3xl font-bold text-gray-800">{currentTitle}</h1>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={handlePrintToPdf} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">{t('print')}</button>
                {isAuthor && (
                  <>
                    <button onClick={() => setShowShareModal(true)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">{t('share')}</button>
                    <button onClick={() => setIsEditing(true)} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">{t('edit')}</button>
                  </>
                )}
              </div>
            </div>

            <div id="recipe-content-wrapper">
              {currentSummary && <p className="text-lg text-gray-600 mb-6 italic border-l-4 border-primary-200 pl-4">{currentSummary}</p>}
              <article id="recipe-content" className="prose prose-base max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentContent}</ReactMarkdown>
              </article>
            </div>
          </div>
        )}
      </div>
      {showShareModal && recipe && <ShareModal recipeId={recipe.id} onClose={() => setShowShareModal(false)} />}
    </>
  );
}
