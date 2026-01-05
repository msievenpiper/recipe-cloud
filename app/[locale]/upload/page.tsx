"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { FaLightbulb, FaCamera, FaTextHeight, FaSun, FaUpload } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function UploadPage() {
  const { data: session, update } = useSession(); // Get session and update function
  const [file, setFile] = useState<File | null>(null);
  const t = useTranslations('Upload');

  const AI_STEPS = [
    t('aiSteps.analyzing'),
    t('aiSteps.extracting'),
    t('aiSteps.generating'),
    t('aiSteps.saving'),
  ];

  const router = useRouter();

  // Redirect if limit reached
  useEffect(() => {
    if (session?.user) {
      // Admins bypass all usage limits
      if (session.user.role === 'ADMIN') return;

      const isPremium = session.user.isPremium;
      const scanCount = session.user.scanCount || 0;
      const limit = isPremium ? 20 : 3;

      if (scanCount >= limit) {
        router.push('/pricing');
      }
    }
  }, [session, router]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [aiSteps, setAiSteps] = useState(AI_STEPS.map(step => ({ name: step, status: 'pending' })));
  const [currentAIStepIndex, setCurrentAIStepIndex] = useState(-1);
  const [aiProcessingComplete, setAiProcessingComplete] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  // Router is already declared above
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [validationStatus, setValidationStatus] = useState<'valid' | 'warning' | 'error'>('valid');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const validateImage = async (file: File): Promise<{ status: 'valid' | 'warning' | 'error'; message?: string }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;

        // 1. Dimension Check - Warning only
        if (width < 600 || height < 600) {
          URL.revokeObjectURL(img.src);
          resolve({ status: 'warning', message: t('validation.lowRes') });
          return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(img.src);
          resolve({ status: 'error', message: t('validation.error') });
          return;
        }
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Convert to grayscale
        const grayData = new Uint8ClampedArray(width * height);
        let sum = 0;
        let sumSq = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          grayData[i / 4] = gray;
          sum += gray;
          sumSq += gray * gray;
        }

        // 2. Contrast Check (Standard Deviation)
        const mean = sum / (width * height);
        const variance = (sumSq / (width * height)) - (mean * mean);
        const stdDev = Math.sqrt(variance);

        if (stdDev < 20) { // Threshold for low contrast
          URL.revokeObjectURL(img.src);
          resolve({ status: 'warning', message: t('validation.lowContrast') });
          return;
        }

        // 3. Blur Check (Laplacian Variance approximation)
        // We'll calculate the variance of the Laplacian of the grayscale image.
        // Simplified Laplacian kernel:
        // 0  1  0
        // 1 -4  1
        // 0  1  0

        let laplacianSum = 0;
        let laplacianSumSq = 0;
        let pixelCount = 0;

        // Skip edges to simplify
        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const i = y * width + x;
            const north = (y - 1) * width + x;
            const south = (y + 1) * width + x;
            const west = y * width + (x - 1);
            const east = y * width + (x + 1);

            const laplacian =
              grayData[north] +
              grayData[south] +
              grayData[west] +
              grayData[east] +
              (-4 * grayData[i]);

            laplacianSum += laplacian;
            laplacianSumSq += laplacian * laplacian;
            pixelCount++;
          }
        }

        const laplacianMean = laplacianSum / pixelCount;
        const laplacianVariance = (laplacianSumSq / pixelCount) - (laplacianMean * laplacianMean);

        if (laplacianVariance < 100) { // Threshold for blur (tune as needed)
          URL.revokeObjectURL(img.src);
          resolve({ status: 'warning', message: t('validation.blurry') });
          return;
        }

        URL.revokeObjectURL(img.src);
        resolve({ status: 'valid' });
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        resolve({ status: 'error', message: t('validation.invalid') });
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
    if (selectedFile) {
      setError(null);
      setValidationStatus('valid');
      setValidationMessage(null);
      setUploadProgress(0);
      setAiSteps(AI_STEPS.map(step => ({ name: step, status: 'pending' })));
      setCurrentAIStepIndex(-1);
      setAiProcessingComplete(false);
      setIsDuplicate(false);

      // Run validation
      const result = await validateImage(selectedFile);
      setValidationStatus(result.status);
      if (result.status !== 'valid') {
        setValidationMessage(result.message || t('validation.warning'));
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const simulateAISteps = async (recipeId: string) => {
    for (let i = 0; i < AI_STEPS.length; i++) {
      setCurrentAIStepIndex(i);
      setAiSteps(prevSteps =>
        prevSteps.map((step, index) =>
          index === i ? { ...step, status: 'in-progress' } : step
        )
      );
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      setAiSteps(prevSteps =>
        prevSteps.map((step, index) =>
          index === i ? { ...step, status: 'completed' } : step
        )
      );
    }
    setAiProcessingComplete(true);
    router.push(`/recipes/${recipeId}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError(t('validation.selectFile'));
      return;
    }

    if (validationStatus === 'error') {
      return; // Prevent submit if validation failed with error
    }
    // Allow submit if status is 'valid' or 'warning'

    setUploading(true);
    setIsDuplicate(false);
    setAiSteps(AI_STEPS.map(step => ({ name: step, status: 'pending' })));
    setCurrentAIStepIndex(-1);
    setAiProcessingComplete(false);

    const formData = new FormData();
    formData.append("image", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setUploadProgress(percentComplete);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        if (data.duplicate) {
          setIsDuplicate(true);
          setTimeout(() => {
            router.push(`/recipes/${data.recipeId}`);
          }, 2000);
        } else {
          update(); // Refresh session to reflect new scan count
          simulateAISteps(data.id);
        }
      } else {
        setUploading(false);
        setError(t('validation.uploadFailed'));
      }
    });

    xhr.addEventListener("error", () => {
      setUploading(false);
      setError(t('validation.uploadError'));
    });

    xhr.open("POST", "/api/recipes");
    xhr.send(formData);
  };

  const overallAIProgress = currentAIStepIndex === -1 ? 0 :
    ((currentAIStepIndex + (aiSteps[currentAIStepIndex]?.status === 'completed' ? 1 : 0)) / AI_STEPS.length) * 100;

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-8 md:p-24 bg-gray-50">
      <div className="w-full max-w-md p-6 md:p-8 bg-white rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary-800">{t('title')}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('subtitle')}
            </label>
            <div className="flex justify-around space-x-4 mb-4">
              <button type="button" onClick={handleUploadClick} className="flex-1 flex flex-col items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
                <FaUpload className="text-xl mb-1" />
                <span>{t('uploadButton')}</span>
              </button>
              <button type="button" onClick={handleCameraClick} className="flex-1 flex flex-col items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
                <FaCamera className="text-xl mb-1" />
                <span>{t('takePhotoButton')}</span>
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
            {file && <p className="mt-2 text-sm text-gray-700 text-center">{t('selectedFile')} <span className="font-semibold">{file.name}</span></p>}
            {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}
            {validationMessage && (
              <div className={`mt-3 p-4 border-l-4 ${validationStatus === 'error' ? 'bg-red-50 border-red-400' : 'bg-yellow-50 border-yellow-400'}`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaLightbulb className={`h-5 w-5 ${validationStatus === 'error' ? 'text-red-400' : 'text-yellow-400'}`} aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm ${validationStatus === 'error' ? 'text-red-700' : 'text-yellow-700'}`}>
                      {validationMessage}
                    </p>
                    <p className={`text-xs mt-1 ${validationStatus === 'error' ? 'text-red-600' : 'text-yellow-600'}`}>
                      {validationStatus === 'error' ? t('validation.uploadBetter') : t('validation.betterQuality')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {uploading && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('progress')}</label>
                <div className="w-full bg-gray-200 rounded-full">
                  <div className="bg-primary-600 text-xs font-medium text-primary-50 text-center p-0.5 leading-none rounded-full" style={{ width: `${uploadProgress}%` }}>
                    {Math.round(uploadProgress)}%
                  </div>
                </div>
              </div>

              {uploadProgress === 100 && !isDuplicate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('aiProcessing')}</label>
                  <div className="w-full bg-gray-200 rounded-full mb-2">
                    <div className="bg-accent text-xs font-medium text-white text-center p-0.5 leading-none rounded-full" style={{ width: `${overallAIProgress}%` }}>
                      {Math.round(overallAIProgress)}%
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {aiSteps.map((step, index) => (
                      <li key={step.name} className="flex items-center">
                        {step.status === 'completed' && <span className="text-green-500 mr-2">✓</span>}
                        {step.status === 'in-progress' && <span className="text-blue-500 mr-2 animate-pulse">...</span>}
                        {step.status === 'pending' && <span className="text-gray-400 mr-2">○</span>}
                        <span className={step.status === 'in-progress' ? 'font-semibold text-blue-700' : ''}>{step.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {isDuplicate && (
                <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-semibold text-blue-800">{t('duplicate')}</p>
                  <p className="text-sm text-blue-700">{t('redirecting')}</p>
                </div>
              )}
            </div>
          )}

          <button type="submit" disabled={uploading || !file || aiProcessingComplete || validationStatus === 'error'} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 transition-colors duration-200">
            {uploading && !aiProcessingComplete ? t('processing') : t('submitButton')}
          </button>
        </form>
      </div>

      <div className="w-full max-w-md mt-8 p-6 md:p-8 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary-800 flex items-center justify-center space-x-2">
          <FaLightbulb className="text-accent" />
          <span>{t('tipsTitle')}</span>
        </h2>
        <ul className="space-y-4 text-gray-700">
          <li className="flex items-start space-x-3">
            <FaCamera className="text-primary-500 text-xl flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold">{t('tips.clearPhotos')}</p>
              <p className="text-sm">{t('tips.clearPhotosDesc')}</p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <FaTextHeight className="text-primary-500 text-xl flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold">{t('tips.contrast')}</p>
              <p className="text-sm">{t('tips.contrastDesc')}</p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <FaSun className="text-primary-500 text-xl flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold">{t('tips.lighting')}</p>
              <p className="text-sm">{t('tips.lightingDesc')}</p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <FaLightbulb className="text-primary-500 text-xl flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold">{t('tips.focus')}</p>
              <p className="text-sm">{t('tips.focusDesc')}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
