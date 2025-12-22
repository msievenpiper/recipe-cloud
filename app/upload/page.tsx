"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaLightbulb, FaCamera, FaTextHeight, FaSun, FaUpload } from "react-icons/fa"; // Added FaUpload icon

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
    if (selectedFile) {
      setError(null); // Clear error when a file is selected
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image or take a photo to upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setProgress(percentComplete);
      }
    });

    xhr.addEventListener("load", () => {
      setUploading(false);
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        router.push(`/recipes/${data.id}`);
      } else {
        setError("Upload failed. Please try again.");
      }
    });

    xhr.addEventListener("error", () => {
      setUploading(false);
      setError("An error occurred during the upload. Please try again.");
    });

    xhr.open("POST", "/api/recipes");
    xhr.send(formData);
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-8 md:p-24 bg-gray-50">
      <div className="w-full max-w-md p-6 md:p-8 bg-white rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary-800">Upload a Recipe Photo</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose an image or take a photo
            </label>
            <div className="flex justify-around space-x-4 mb-4">
              <button
                type="button"
                onClick={handleUploadClick}
                className="flex-1 flex flex-col items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <FaUpload className="text-xl mb-1" />
                <span>Upload Photo</span>
              </button>
              <button
                type="button"
                onClick={handleCameraClick}
                className="flex-1 flex flex-col items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <FaCamera className="text-xl mb-1" />
                <span>Take Photo</span>
              </button>
            </div>

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            {file && (
              <p className="mt-2 text-sm text-gray-700 text-center">Selected file: <span className="font-semibold">{file.name}</span></p>
            )}
            {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}
          </div>

          {uploading && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Progress</label>
              <div className="w-full bg-gray-200 rounded-full">
                <div
                  className="bg-primary-600 text-xs font-medium text-primary-50 text-center p-0.5 leading-none rounded-full"
                  style={{ width: `${progress}%` }}
                >
                  {Math.round(progress)}%
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 transition-colors duration-200"
          >
            {uploading ? "Uploading..." : "Upload and Process"}
          </button>
        </form>
      </div>

      {/* Tips for Best Results Section */}
      <div className="w-full max-w-md mt-8 p-6 md:p-8 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary-800 flex items-center justify-center space-x-2">
          <FaLightbulb className="text-accent" />
          <span>Tips for Best Results</span>
        </h2>
        <ul className="space-y-4 text-gray-700">
          <li className="flex items-start space-x-3">
            <FaCamera className="text-primary-500 text-xl flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold">Clear & Steady Photos:</p>
              <p className="text-sm">Ensure your recipe photo is well-lit and not blurry. Hold your camera steady!</p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <FaTextHeight className="text-primary-500 text-xl flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold">Good Contrast:</p>
              <p className="text-sm">Text should stand out clearly from the background. Avoid busy patterns behind the recipe.</p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <FaSun className="text-primary-500 text-xl flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold">Even Lighting:</p>
              <p className="text-sm">Avoid shadows cast over the text. Natural, indirect light often works best.</p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <FaLightbulb className="text-primary-500 text-xl flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold">Focus on the Recipe:</p>
              <p className="text-sm">Crop out unnecessary background elements to help the AI focus on the recipe text.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
