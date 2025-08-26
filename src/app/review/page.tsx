"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export type MetaRow = {
  filename: string;
  title?: string;
  description?: string;
  keywords: string;
  category?: number;
  categories?: string;
  releases?: string;
  editorial?: string;
  matureContent?: string;
  illustration?: string;
};

const defaultCategory = 8;

export default function ReviewPage() {
  const [rows, setRows] = useState<MetaRow[]>([]);
  const [platform, setPlatform] = useState<string>("adobe");
  const [regenerating, setRegenerating] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("metadata_rows") || "[]");
      const selectedPlatform = localStorage.getItem("selected_platform") || "adobe";
      setRows(data);
      setPlatform(selectedPlatform);
    } catch {
      setRows([]);
    }
  }, []);

  const updateRow = (idx: number, patch: Partial<MetaRow>) => {
    setRows((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      localStorage.setItem("metadata_rows", JSON.stringify(next));
      return next;
    });
  };

  const regenerateField = async (idx: number, field: 'title' | 'description' | 'keywords') => {
    const row = rows[idx];
    if (!row) return;
    
    const key = `${idx}-${field}`;
    setRegenerating(prev => ({ ...prev, [key]: true }));
    
    try {
      const apiEndpoint = platform === "adobe" ? "/api/metadata" : "/api/shutterstock-metadata";
      const resp = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filenames: [row.filename] }),
      });
      const json = await resp.json();
      const result = json?.data?.[0];
      
      if (result) {
        if (field === 'title' && result.title) {
          updateRow(idx, { title: result.title });
        } else if (field === 'description' && result.description) {
          updateRow(idx, { description: result.description });
        } else if (field === 'keywords' && result.keywords) {
          updateRow(idx, { keywords: result.keywords });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRegenerating(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="py-10 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Review & Edit Metadata</h1>
        <p className="text-gray-600">
          {rows.length > 0 
            ? `Review and edit the generated ${platform === "adobe" ? "Adobe Stock" : "Shutterstock"} metadata before exporting`
            : "No metadata available. Please upload files and generate metadata first."}
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <Button asChild variant="outline">
          <Link href="/">← Back to Home</Link>
        </Button>
        <Button asChild disabled={rows.length === 0} size="lg">
          <Link href="/export">
            Next: Export CSV →
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-4 px-2 sm:px-4">
        {rows.map((row, idx) => (
          <div key={`${row.filename}-${idx}`} className="bg-white border border-gray-200 rounded-lg p-4 lg:p-4 space-y-2 lg:space-y-2">
            <h3 className="font-semibold text-sm lg:text-lg text-gray-900 truncate" title={row.filename}>
               {row.filename}
             </h3>
            
            {platform === "adobe" ? (
              <>
                {/* Title Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Title</label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => regenerateField(idx, 'title')}
                      disabled={regenerating[`${idx}-title`]}
                      className="text-xs px-3 py-1"
                    >
                      {regenerating[`${idx}-title`] ? 'Generating...' : 'Re-Generate'}
                    </Button>
                  </div>
                  <Input 
                    value={row.title || ""} 
                    onChange={(e) => updateRow(idx, { title: e.target.value.slice(0, 200) })} 
                    placeholder="Enter title..."
                  />
                </div>
                
                {/* Keywords Field */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Keywords</label>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {row.keywords.split(',').map(k => k.trim()).filter(Boolean).length}/49
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => regenerateField(idx, 'keywords')}
                        disabled={regenerating[`${idx}-keywords`]}
                        className="text-xs px-3 py-1"
                      >
                        {regenerating[`${idx}-keywords`] ? 'Generating...' : 'Re-Generate'}
                      </Button>
                    </div>
                    <div className="border border-gray-300 rounded-md p-3 bg-white">
                      <div className="flex flex-wrap gap-1 mb-1 max-h-16 overflow-y-auto">
                        {row.keywords.split(',').map((keyword, kidx) => {
                          const trimmed = keyword.trim();
                          if (!trimmed) return null;
                          return (
                            <span
                              key={kidx}
                              className="inline-flex items-center gap-1 px-1 py-1 bg-blue-100 text-blue-800 text-xs rounded-md flex-shrink-0"
                            >
                              {trimmed}
                              <button
                                onClick={() => {
                                  const keywords = row.keywords.split(',').map(k => k.trim()).filter(Boolean);
                                  keywords.splice(kidx, 1);
                                  updateRow(idx, { keywords: keywords.join(', ') });
                                }}
                                className="ml-1 text-blue-600 hover:text-blue-800"
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
                      <Input
                        placeholder="Add keyword and press Enter..."
                        className="border-0 p-0 text-sm focus:ring-0 shadow-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const newKeyword = e.currentTarget.value.trim();
                            if (newKeyword) {
                              const keywords = row.keywords.split(',').map(k => k.trim()).filter(Boolean);
                              if (!keywords.includes(newKeyword) && keywords.length < 49) {
                                keywords.push(newKeyword);
                                updateRow(idx, { keywords: keywords.join(', ') });
                                e.currentTarget.value = '';
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                
                {/* Category and Releases */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <Select
                      value={String(row.category || defaultCategory)}
                      onChange={(e) => updateRow(idx, { category: Math.min(21, Math.max(1, Number(e.target.value) || defaultCategory)) })}
                    >
                      {Array.from({ length: 21 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Releases</label>
                    <Input 
                      value={row.releases || ""} 
                      onChange={(e) => updateRow(idx, { releases: e.target.value })} 
                      placeholder="Optional" 
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Description Field */}
                 <div className="space-y-2">
                   <div className="flex items-center justify-between">
                     <label className="text-sm font-medium text-gray-700">Descriptions</label>
                     <Button
                       size="sm"
                       variant="outline"
                       onClick={() => regenerateField(idx, 'description')}
                       disabled={regenerating[`${idx}-description`]}
                       className="text-xs px-3 py-1"
                     >
                       {regenerating[`${idx}-description`] ? 'Generating...' : 'Re-Generate'}
                     </Button>
                   </div>
                   <Input
                     value={row.description || ""}
                     onChange={(e) => updateRow(idx, { description: e.target.value.slice(0, 200) })}
                     placeholder="Enter description..."
                   />
                 </div>
                
                {/* Keywords Field */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Keywords</label>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {row.keywords.split(',').map(k => k.trim()).filter(Boolean).length}/50
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => regenerateField(idx, 'keywords')}
                        disabled={regenerating[`${idx}-keywords`]}
                        className="text-xs px-3 py-1"
                      >
                        {regenerating[`${idx}-keywords`] ? 'Generating...' : 'Re-Generate'}
                      </Button>
                    </div>
                    <div className="border border-gray-300 rounded-md p-3 bg-white">
                      <div className="flex flex-wrap gap-1 mb-1 max-h-16 overflow-y-auto">
                        {row.keywords.split(',').map((keyword, kidx) => {
                          const trimmed = keyword.trim();
                          if (!trimmed) return null;
                          return (
                            <span
                              key={kidx}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md flex-shrink-0"
                            >
                              {trimmed}
                              <button
                                onClick={() => {
                                  const keywords = row.keywords.split(',').map(k => k.trim()).filter(Boolean);
                                  keywords.splice(kidx, 1);
                                  updateRow(idx, { keywords: keywords.join(', ') });
                                }}
                                className="ml-1 text-blue-600 hover:text-blue-800"
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
                      <Input
                        placeholder="Add keyword and press Enter..."
                        className="border-0 p-0 text-sm focus:ring-0 shadow-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const newKeyword = e.currentTarget.value.trim();
                            if (newKeyword) {
                              const keywords = row.keywords.split(',').map(k => k.trim()).filter(Boolean);
                              if (!keywords.includes(newKeyword) && keywords.length < 50) {
                                keywords.push(newKeyword);
                                updateRow(idx, { keywords: keywords.join(', ') });
                                e.currentTarget.value = '';
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                
                {/* Categories */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Categories</label>
                  <Input 
                    value={row.categories || ""} 
                    onChange={(e) => updateRow(idx, { categories: e.target.value })} 
                    placeholder="e.g. Technology, Business" 
                  />
                </div>
                
                {/* Editorial, Mature Content, Illustration */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Editorial</label>
                    <Select
                      value={row.editorial || "No"}
                      onChange={(e) => updateRow(idx, { editorial: e.target.value })}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Mature</label>
                    <Select
                      value={row.matureContent || "No"}
                      onChange={(e) => updateRow(idx, { matureContent: e.target.value })}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Illustration</label>
                    <Select
                      value={row.illustration || "Yes"}
                      onChange={(e) => updateRow(idx, { illustration: e.target.value })}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
        
        {rows.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No data yet. Please upload files and generate metadata first.
          </div>
        )}
      </div>
    </div>
  );
}