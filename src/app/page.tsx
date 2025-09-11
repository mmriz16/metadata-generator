"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface UploadedFile {
  filename: string;
  status: "Pending" | "Uploaded" | "Error";
  file?: File;
  preview?: string;
}

const ACCEPTED = {
  "image/svg+xml": [".svg"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "application/pdf": [".ai"],
};

export default function Home() {
  const [items, setItems] = useState<UploadedFile[]>([]);

  // Clear localStorage when returning to home page
  useEffect(() => {
    localStorage.removeItem("uploaded_files");
    localStorage.removeItem("metadata_rows");
    localStorage.removeItem("selected_platform");
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newItems = acceptedFiles.map((file) => {
      // Create preview URL for images
      let preview = '';
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }
      
      return {
        filename: file.name,
        status: "Pending" as const,
        file: file,
        preview: preview
      };
    });
    
    const updatedItems = [...items, ...newItems];
    setItems(updatedItems);
    
    // Save to localStorage for access in generate page
    const itemsToSave = updatedItems.map(item => ({
      filename: item.filename,
      status: item.status,
      preview: item.preview
    }));
    localStorage.setItem('uploadedFiles', JSON.stringify(itemsToSave));
    
    // Also save the actual files separately (for form submission)
    const filesArray = updatedItems.map(item => item.file).filter(Boolean);
    // Note: Files can't be directly stored in localStorage, so we'll handle this in the generate page
  }, [items]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    multiple: true,
  });



  return (
    <div className="bg-gray-50 flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="flex-1 flex flex-col justify-between max-w-6xl mx-auto w-full px-4 sm:px-6">
        {/* Header Section */}
        <div className="pt-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">Metadata Generator</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload icons → Select platform → AI generates metadata → Export CSV
            </p>
          </div>
        </div>
        
        {/* Main Content - Drag & Drop Area */}
        <div className="flex-1 flex items-center justify-center py-8">
          {/* Upload Section */}
          <div className="w-full max-w-2xl">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragActive 
              ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-400 shadow-lg scale-105" 
              : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 hover:shadow-md"
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-6">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto transition-all duration-300 ${
              isDragActive ? "bg-blue-100 scale-110" : "bg-gray-200"
            }`}>
              <svg className={`w-10 h-10 transition-colors ${
                isDragActive ? "text-blue-600" : "text-gray-500"
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className={`text-xl font-semibold transition-colors ${
                isDragActive ? "text-blue-900" : "text-gray-900"
              }`}>
                {isDragActive ? "🎯 Drop files here" : "📁 Drag & drop files here"}
              </p>
              <p className="text-sm text-gray-600">
                or <span className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">click to browse</span>
              </p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 border border-gray-200">SVG</span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 border border-gray-200">PNG</span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 border border-gray-200">AI</span>
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>
        
        {/* Bottom Section - Navigation */}
        <div className="pb-8">
          {items.length > 0 ? (
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-lg">✅</span>
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-semibold text-green-900">
                      {items.length} files uploaded successfully!
                    </span>
                    <p className="text-xs text-green-600">Ready for metadata generation</p>
                  </div>
                </div>
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <Link href="/generate">Next: Generate Metadata →</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-gray-500">Or access existing data:</p>
              <div className="flex justify-center gap-4">
                <Button asChild variant="outline">
                  <Link href="/review">Review Metadata</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/export">Export CSV</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
