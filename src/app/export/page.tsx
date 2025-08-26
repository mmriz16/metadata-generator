"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ExportFormat = "adobe" | "shutterstock";

interface MetadataRow {
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
}

export default function ExportPage() {
  const [rows, setRows] = useState<MetadataRow[]>([]);
  const [format, setFormat] = useState<ExportFormat>("adobe");
  
  const adobeHeaders = ["Filename", "Title", "Keywords", "Category", "Releases"] as const;
  const shutterstockHeaders = ["Filename", "Description", "Keywords", "Categories", "Editorial", "Mature Content", "Illustration"] as const;
  
  const headers = format === "adobe" ? adobeHeaders : shutterstockHeaders;

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("metadata_rows") || "[]");
      const selectedPlatform = localStorage.getItem("selected_platform") || "adobe";
      setRows(data);
      setFormat(selectedPlatform as ExportFormat);
    } catch {
      setRows([]);
    }
  }, []);

  const csvData = useMemo(() => {
    if (format === "adobe") {
      const dataRows = rows.map((r) => [
        r.filename,
        (r.title || "").slice(0, 200),
        (r.keywords || "")
          .split(",")
          .map((x: string) => x.trim())
          .filter(Boolean)
          .slice(0, 49)
          .join(", "),
        Math.min(21, Math.max(1, Number(r.category) || 8)),
        r.releases || "",
      ]);
      return Papa.unparse({ fields: headers as unknown as string[], data: dataRows });
    } else {
      const dataRows = rows.map((r) => [
        r.filename,
        (r.description || "").slice(0, 200),
        (r.keywords || "")
          .split(",")
          .map((x: string) => x.trim())
          .filter(Boolean)
          .slice(0, 50)
          .join(", "),
        r.categories || "Miscellaneous",
        r.editorial || "No",
        r.matureContent || "No",
        r.illustration || "Yes",
      ]);
      return Papa.unparse({ fields: headers as unknown as string[], data: dataRows });
    }
  }, [format, rows, headers]);

  const handleDownload = () => {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = format === "adobe" ? "adobe_stock_metadata.csv" : "shutterstock_metadata.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const truncateText = (text: string, maxLines: number = 2) => {
    const words = text.split(' ');
    const wordsPerLine = 8; // Approximate words per line
    const maxWords = maxLines * wordsPerLine;
    
    if (words.length <= maxWords) {
      return text;
    }
    
    return words.slice(0, maxWords).join(' ') + '...';
  };

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Export CSV</h1>
        <p className="text-gray-600">
          {rows.length > 0 
            ? `Ready to export ${rows.length} metadata entries to ${format === "adobe" ? "Adobe Stock" : "Shutterstock"} CSV format`
            : "No metadata available. Please upload files and generate metadata first."}
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <Button asChild variant="outline">
          <Link href="/review">← Back to Review</Link>
        </Button>
        
        <Button 
           onClick={handleDownload} 
           disabled={rows.length === 0}
           size="lg"
           className="bg-green-600 hover:bg-green-700 text-white"
         >
           📥 Download CSV ({rows.length} files)
         </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {format === "adobe" ? (
              rows.map((r, idx) => (
                <TableRow key={`${r.filename}-${idx}`}>
                  <TableCell className="max-w-[200px]">
                    <div className="truncate" title={r.filename}>{r.filename}</div>
                  </TableCell>
                  <TableCell className="max-w-[250px]">
                    <div className="line-clamp-2" title={(r.title || "").slice(0, 200)}>
                      {truncateText((r.title || "").slice(0, 200))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className="line-clamp-2" title={(r.keywords || "")
                      .split(",")
                      .map((x: string) => x.trim())
                      .filter(Boolean)
                      .slice(0, 49)
                      .join(", ")}>
                      {truncateText((r.keywords || "")
                        .split(",")
                        .map((x: string) => x.trim())
                        .filter(Boolean)
                        .slice(0, 49)
                        .join(", "))}
                    </div>
                  </TableCell>
                  <TableCell>{Math.min(21, Math.max(1, Number(r.category) || 8))}</TableCell>
                  <TableCell className="max-w-[150px]">
                    <div className="truncate" title={r.releases || ""}>{r.releases || ""}</div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              rows.map((r, idx) => (
                <TableRow key={`${r.filename}-${idx}`}>
                  <TableCell className="max-w-[200px]">
                    <div className="truncate" title={r.filename}>{r.filename}</div>
                  </TableCell>
                  <TableCell className="max-w-[250px]">
                    <div className="line-clamp-2" title={(r.description || "").slice(0, 200)}>
                      {truncateText((r.description || "").slice(0, 200))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className="line-clamp-2" title={(r.keywords || "")
                      .split(",")
                      .map((x: string) => x.trim())
                      .filter(Boolean)
                      .slice(0, 50)
                      .join(", ")}>
                      {truncateText((r.keywords || "")
                        .split(",")
                        .map((x: string) => x.trim())
                        .filter(Boolean)
                        .slice(0, 50)
                        .join(", "))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[150px]">
                    <div className="truncate" title={r.categories || "Miscellaneous"}>{r.categories || "Miscellaneous"}</div>
                  </TableCell>
                  <TableCell>{r.editorial || "No"}</TableCell>
                  <TableCell>{r.matureContent || "No"}</TableCell>
                  <TableCell>{r.illustration || "Yes"}</TableCell>
                </TableRow>
              ))
            )}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={headers.length} className="text-center text-gray-500">
                  No data to export.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>


    </div>
  );
}