"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [tokenUsage, setTokenUsage] = useState<{
    totalTokens: number;
    estimatedCost: number;
    requestCount: number;
  }>({ totalTokens: 0, estimatedCost: 0, requestCount: 0 });

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("metadata_rows") || "[]");
      const selectedPlatform = localStorage.getItem("selected_platform") || "adobe";
      const savedTokenUsage = JSON.parse(localStorage.getItem("token_usage") || "{\"totalTokens\": 0, \"estimatedCost\": 0, \"requestCount\": 0}");
      setRows(data);
      setPlatform(selectedPlatform);
      setTokenUsage(savedTokenUsage);
    } catch {
      setRows([]);
      setTokenUsage({ totalTokens: 0, estimatedCost: 0, requestCount: 0 });
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
    
    // Check if API key is available
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      alert('Please set your OpenAI API key in Settings first.');
      return;
    }
    
    const key = `${idx}-${field}`;
    setRegenerating(prev => ({ ...prev, [key]: true }));
    
    try {
      const apiEndpoint = platform === "adobe" ? "/api/metadata" : "/api/shutterstock-metadata";
      const resp = await fetch(apiEndpoint, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-openai-api-key": apiKey,
        },
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
        
        // Update token usage (estimate based on regeneration)
        const estimatedTokens = field === 'title' ? 100 : field === 'keywords' ? 200 : 150;
        // GPT-4o-mini pricing: $0.15 per 1M input tokens, $0.60 per 1M output tokens
        // Assuming 70% input, 30% output tokens
        const inputTokens = Math.floor(estimatedTokens * 0.7);
        const outputTokens = Math.floor(estimatedTokens * 0.3);
        const additionalCost = (inputTokens * 0.15 / 1000000) + (outputTokens * 0.60 / 1000000);
        const newTokenUsage = {
          totalTokens: tokenUsage.totalTokens + estimatedTokens,
          estimatedCost: tokenUsage.estimatedCost + additionalCost,
          requestCount: tokenUsage.requestCount + 1
        };
        setTokenUsage(newTokenUsage);
        localStorage.setItem("token_usage", JSON.stringify(newTokenUsage));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRegenerating(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="bg-gray-50" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Review & Edit Metadata</h1>
        <p className="text-gray-600">
          {rows.length > 0 
            ? `Review and edit the generated ${platform === "adobe" ? "Adobe Stock" : "Shutterstock"} metadata before exporting`
            : "No metadata available. Please upload files and generate metadata first."}
        </p>
      </div>
      
      {/* Token Usage Information */}
      {rows.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-lg">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-blue-900">Informasi Penggunaan Token</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="text-sm text-blue-600 font-medium">Total Token Terpakai</div>
              </div>
              <div className="text-2xl font-bold text-blue-900 mb-1">{tokenUsage.totalTokens.toLocaleString()}</div>
              <div className="text-xs text-blue-500">token</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="text-sm text-blue-600 font-medium">Estimasi Biaya</div>
              </div>
              <div className="text-2xl font-bold text-blue-900 mb-1">${tokenUsage.estimatedCost.toFixed(4)}</div>
              <div className="text-xs text-blue-500">USD (GPT-4o-mini)</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="text-sm text-blue-600 font-medium">Total Request</div>
              </div>
              <div className="text-2xl font-bold text-blue-900 mb-1">{tokenUsage.requestCount}</div>
              <div className="text-xs text-blue-500">API calls</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="text-sm text-blue-600 font-medium">Icon Tergenerate</div>
              </div>
              <div className="text-2xl font-bold text-blue-900 mb-1">{rows.length}</div>
              <div className="text-xs text-blue-500">files</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 text-sm">💡</span>
              <div className="text-xs text-blue-700 leading-relaxed">
                Biaya dihitung berdasarkan tarif GPT-4o-mini: $0.15 per 1M input tokens, $0.60 per 1M output tokens
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href="/">← Back to Home</Link>
        </Button>
        <Button asChild disabled={rows.length === 0} size="lg" className="w-full sm:w-auto">
          <Link href="/export">
            Next: Export CSV →
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {rows.map((row, idx) => (
          <div key={`${row.filename}-${idx}`} className="bg-white border border-gray-200 rounded-xl p-2 space-y-4 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
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
                      className="text-xs px-3 py-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                    >
                      {regenerating[`${idx}-title`] ? (
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          Generating...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          🔄 Re-Generate
                        </span>
                      )}
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
                        className="text-xs px-3 py-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                      >
                        {regenerating[`${idx}-keywords`] ? (
                          <span className="flex items-center gap-1">
                            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            Generating...
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            🔄 Re-Generate
                          </span>
                        )}
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
                    <select
                      value={String(row.category || defaultCategory)}
                      onChange={(e) => updateRow(idx, { category: Math.min(21, Math.max(1, Number(e.target.value) || defaultCategory)) })}
                      className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {Array.from({ length: 21 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
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
                       className="text-xs px-3 py-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                     >
                       {regenerating[`${idx}-description`] ? (
                         <span className="flex items-center gap-1">
                           <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                           Generating...
                         </span>
                       ) : (
                         <span className="flex items-center gap-1">
                           🔄 Re-Generate
                         </span>
                       )}
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
                    <select
                      value={row.editorial || "No"}
                      onChange={(e) => updateRow(idx, { editorial: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Mature</label>
                    <select
                      value={row.matureContent || "No"}
                      onChange={(e) => updateRow(idx, { matureContent: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Illustration</label>
                    <select
                      value={row.illustration || "Yes"}
                      onChange={(e) => updateRow(idx, { illustration: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
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
    </div>
  );
}