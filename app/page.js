"use client"
import Image from "next/image";
import { useState } from 'react'
import { useDropzone } from "react-dropzone"
import { useUploadThing } from "./lib/uploadthing";

export default function Home() {
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)

  const { startUpload, isUploading } = useUploadThing("mediaUploader", {
    onClientUploadComplete: (res) => {
      console.log("Upload success:", res);
      setFile(null);
      setPreview(null);
      setError(null);
    },
    onUploadError: (error) => {
      console.error("Full upload error:", error);
      setError(`Upload failed: ${error.message || "Unknown error"}`);
    },
    onUploadBegin: () => {
      console.log("Upload started...");
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setError(null);
      const file = acceptedFiles[0];
      if (file) {
        setPreview(URL.createObjectURL(file));
        setFile(file);
      }
    }
  });

  const handleUpload = async () => {
    if (!file) return;
    
    console.log("Starting upload with file:", file.name, file.size);
    
    try {
      setError(null);
      const result = await startUpload([file]);
      console.log("Upload result:", result);
    } catch (error) {
      console.error("Catch block error:", error);
      setError(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          File Upload
        </h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div 
          {...getRootProps()} 
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          <input {...getInputProps()} />
          
          {!preview ? (
            <div className="space-y-2">
              <div className="text-gray-600">
                {isDragActive ? (
                  <p>Drop the file here...</p>
                ) : (
                  <p>Click here or drag and drop files to upload</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative mx-auto w-48 h-48">
                <Image 
                  src={preview} 
                  alt="Preview"
                  height={200}
                  width={400}
                  className="object-cover rounded-lg"
                />
              </div>
              <p className="text-sm text-gray-600">{file?.name}</p>
            </div>
          )}
        </div>
        
        {file && (
          <div className="mt-6 flex justify-center">
            <button 
              onClick={handleUpload}
              disabled={isUploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? "Uploading..." : "Upload File"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}