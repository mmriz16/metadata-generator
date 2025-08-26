"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ACCEPTED = {
  "image/svg+xml": [".svg"],
  "image/png": [".png"],
  "application/postscript": [".ai"],
  "application/pdf": [".ai"],
};

export type UploadItem = {
  file?: File;
  filename: string;
  status: "Pending" | "Processing" | "Done";
};

export default function FileUploader() {
  const [items, setItems] = useState<UploadItem[]>([]);

  // Hydrate from localStorage so total count (and list) persists across refreshes
  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem("uploaded_files") || "[]") as { filename: string }[];
      if (Array.isArray(existing) && existing.length) {
        setItems(existing.map((e) => ({ filename: e.filename, status: "Pending" as const })));
      }
    } catch {
      // ignore
    }
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const mapped = acceptedFiles.map((file) => ({ file, filename: file.name, status: "Pending" as const }));
    setItems((prev) => [...prev, ...mapped]);
    // Persist to localStorage for next steps
    const persisted = [...items, ...mapped].map(({ filename }) => ({ filename }));
    localStorage.setItem("uploaded_files", JSON.stringify(persisted));
    // Invalidate previous metadata so Review regenerates for new uploads
    localStorage.removeItem("metadata_rows");
  }, [items]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    multiple: true,
  });

  return (
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

      {/* Total count */}
      {items.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-900">
                Total icons uploaded: {items.length}
              </span>
            </div>
            <span className="text-xs text-blue-600">Ready for metadata generation</span>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
         <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Filename</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((it, idx) => (
              <TableRow key={`${it.filename}-${idx}`}>
                <TableCell>{it.filename}</TableCell>
                <TableCell>{it.status}</TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-gray-500">No files uploaded yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
          </Table>
        </div>
    </div>
  );
}