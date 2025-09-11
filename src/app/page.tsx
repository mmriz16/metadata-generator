"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ACCEPTED = {
  "image/svg+xml": [".svg"],
  "image/png": [".png"],
  "application/postscript": [".ai"],
  "application/pdf": [".ai"],
};

type Platform = "adobe" | "shutterstock";

export type UploadItem = {
  file?: File;
  filename: string;
  status: "Pending" | "Processing" | "Done";
};

export default function Home() {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [platform, setPlatform] = useState<Platform>("adobe");
  const [loading, setLoading] = useState(false);

  // Clear localStorage when returning to home page
  useEffect(() => {
    localStorage.removeItem("uploaded_files");
    localStorage.removeItem("metadata_rows");
    localStorage.removeItem("selected_platform");
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const mapped = acceptedFiles.map((file) => ({ file, filename: file.name, status: "Pending" as const }));
    setItems((prev) => [...prev, ...mapped]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    multiple: true,
  });

  const handleGenerate = async () => {
    if (items.length === 0) return;
    
    setLoading(true);
    
    // Save to localStorage
    const persisted = items.map(({ filename }) => ({ filename }));
    localStorage.setItem("uploaded_files", JSON.stringify(persisted));
    localStorage.setItem("selected_platform", platform);
    
    try {
      const apiEndpoint = platform === "adobe" ? "/api/metadata" : "/api/shutterstock-metadata";
      const resp = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filenames: items.map((item) => item.filename) }),
      });
      const json = await resp.json();
      const results = json?.data ?? [];
      localStorage.setItem("metadata_rows", JSON.stringify(results));
      
      // Calculate and save token usage
      const fileCount = items.length;
      const estimatedTokensPerFile = platform === "adobe" ? 305 : 350; // title(100) + keywords(200) + category(5) for Adobe, slightly more for Shutterstock
      const totalTokens = fileCount * estimatedTokensPerFile;
      const estimatedCost = totalTokens * 0.00015; // $0.00015 per 1K tokens for GPT-4o-mini
      const requestCount = fileCount * (platform === "adobe" ? 3 : 2); // Adobe: 3 requests per file (title, keywords, category), Shutterstock: 2 requests
      
      const tokenUsage = {
        totalTokens,
        estimatedCost,
        requestCount
      };
      localStorage.setItem("token_usage", JSON.stringify(tokenUsage));
      
      // Redirect to review page
      window.location.href = "/review";
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="flex-1 flex flex-col justify-between max-w-6xl mx-auto w-full px-4">
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
        
        {/* Bottom Section - Platform Selection or Quick Access */}
        <div className="pb-8">
          {items.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-lg">📁</span>
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-blue-900">
                        {items.length} files uploaded
                      </span>
                      <p className="text-xs text-blue-600">Ready for metadata generation</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-blue-900">Platform:</label>
                      <select 
                        value={platform} 
                        onChange={(e) => setPlatform(e.target.value as Platform)}
                        className="px-4 py-2 border border-blue-300 rounded-lg bg-white text-sm font-medium text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:shadow-md transition-all"
                      >
                        <option value="adobe">📊 Adobe Stock</option>
                        <option value="shutterstock">🖼️ Shutterstock</option>
                      </select>
                    </div>
                    <Button 
                      onClick={handleGenerate}
                      disabled={loading}
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Generating Metadata...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          ✨ Generate Metadata
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
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
