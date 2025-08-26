"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
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
      
      // Redirect to review page
      window.location.href = "/review";
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">AS Metadata Generator</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload icons → Select platform → AI generates metadata → Export CSV
        </p>
      </div>
      
      {/* Upload Section */}
      <div className="space-y-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? "bg-blue-50 border-blue-300" 
              : "bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or <span className="text-blue-600 font-medium">click to browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Supports SVG, PNG, and AI files
              </p>
            </div>
          </div>
        </div>

        {/* Platform Selection */}
        {items.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-900">
                  {items.length} files uploaded
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-blue-900">Platform:</label>
                  <Select value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
                    <option value="adobe">Adobe Stock</option>
                    <option value="shutterstock">Shutterstock</option>
                  </Select>
                </div>
                <Button 
                  onClick={handleGenerate}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? "Generating..." : "Generate Metadata"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* File List */}
        {items.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, idx) => (
                  <TableRow key={`${item.filename}-${idx}`}>
                    <TableCell>{item.filename}</TableCell>
                    <TableCell>{item.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      {/* Quick Access */}
      {items.length === 0 && (
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
  );
}
