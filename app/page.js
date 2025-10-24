"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadThing } from "./lib/uploadthing";

export default function Home() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [expiry,setExpiry]=useState('10m')

  const { startUpload, isUploading } = useUploadThing("mediaUploader", {
    onClientUploadComplete:async (res) => {
      if (res && res[0]) {
      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: res[0].name,
          url: res[0].url,
          fileType: res[0].type,
          fileSize: res[0].size,
          expiry: expiry
        })
      });
    }
      setFile(null);
      setPreview(null);
      setError(null);
      fetchUploads();
    },
    onUploadError: (error) => {
      setError(`Upload failed: ${error.message}`);
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
    },
  });

  const handleUpload = async () => {
    if (!file) return;

    try {
      await startUpload([file]);
    } catch (error) {
      console.log(error)
    }
  };

  const fetchUploads = async () => {
    try {
      const res = await fetch("/api/uploads");
      const data = await res.json();
      setUploads(data);
    } catch (error) {
      console.error("Failed to load files");
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

return (
  
    <div className="max-w-4xl mx-auto rounded-lg shadow-md p-6">
      <h1 className="text-4xl font-bold text-red-800 mb-6 text-center">
        <span className="text-[#A81454]">QUICK<span className="text-[#5A71D6] animate-bounce inline-block">DROP</span>
</span>

      </h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div 
        {...getRootProps()} 
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400"
      >
        <input {...getInputProps()} />
        
        {!preview ? (
          <div>
            <div className="text-gray-600">
              {isDragActive ? "Drop the file here..." : "Click or drag files to upload"}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative mx-auto w-48 h-48">
              <img 
                src={preview} 
                alt="Preview"
                
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <p className="text-sm text-gray-600">{file?.name}</p>
          </div>
        )}
      </div>
      {file && 
      <div className='text-black'>
        <label>Expiry time</label>
        <select value={expiry} onChange={e=>{setExpiry(e.target.value)}}>
          <option value='10m'>10 minutes</option>
          <option value='1h'>1 hour</option>
          <option value='1d'>1 day</option>
        </select>
      </div>
      }
      {file && (
        <div className="mt-6 flex justify-center">
          <button 
            onClick={handleUpload}
            disabled={isUploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isUploading ? "Uploading" : "Upload File"}
          </button>
        </div>
      )}
      <div className="space-y-4 mt-8">
        <h2 className="text-center text-blue-500 text-xl font-bold">Uploaded Files</h2>
        <div className="grid grid-cols-2 gap-4">
          {uploads.map((u) => (
            <div key={u.id} className="bg-blue-200 rounded-lg p-3">
              <a href={`/uploads/${u.id}`} className="block">
                <div className="aspect-square overflow-hidden">
              <img
                src={u.url}
                alt={u.name}
                className="w-ful h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
                <p className="text-xs mt-2 text-pink-400 truncate">{u.name}</p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
);
}
