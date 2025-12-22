"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
    if (selectedFile) {
      setError(null); // Clear error when a file is selected
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image to upload.");
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
    <div className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Upload a Recipe</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
              Recipe Image
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          {uploading && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Progress</label>
              <div className="w-full bg-gray-200 rounded-full mt-1">
                <div
                  className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                  style={{ width: `${progress}%` }}
                >
                  {Math.round(progress)}%
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {uploading ? "Uploading..." : "Upload and Process"}
          </button>
        </form>
      </div>
    </div>
  );
}
