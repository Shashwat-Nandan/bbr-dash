"use client";

import { useState, useRef, useCallback } from "react";
import { parseBbrExcel } from "@/lib/parse-excel-client";

export default function UploadForm() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    setMessage(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length) {
        const file = e.dataTransfer.files[0];
        if (fileInputRef.current) {
          const dt = new DataTransfer();
          dt.items.add(file);
          fileInputRef.current.files = dt.files;
        }
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.length) return;

    setIsUploading(true);
    setMessage(null);

    try {
      // Parse Excel client-side
      const file = fileInputRef.current.files[0];
      const arrayBuffer = await file.arrayBuffer();
      const data = parseBbrExcel(arrayBuffer);

      // Send only the parsed JSON to the server
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const text = await res.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        setMessage({ type: "error", text: `Server error (${res.status}): ${text.substring(0, 200)}` });
        return;
      }

      if (res.ok) {
        setMessage({ type: "success", text: result.message });
        setFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setMessage({ type: "error", text: result.error || `Error ${res.status}` });
      }
    } catch (err) {
      setMessage({ type: "error", text: `Error: ${err instanceof Error ? err.message : "Unknown error"}` });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {message && (
        <div
          className={`rounded-xl px-4 py-3.5 mb-5 text-[13px] font-medium ${
            message.type === "success"
              ? "bg-success/10 border border-success/25 text-success"
              : "bg-danger/10 border border-danger/25 text-danger"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-[20px] p-9 text-center">
        <form onSubmit={handleSubmit}>
          <div
            className={`border-2 border-dashed rounded-2xl p-12 px-6 mb-6 transition-all cursor-pointer ${
              isDragOver
                ? "border-brand-blue bg-brand-blue/15"
                : "border-white/10 hover:border-brand-blue hover:bg-brand-blue/15"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            <div className="text-[40px] mb-3">&#x1F4C1;</div>
            <h4 className="text-base font-semibold mb-1">Drop your Excel file here</h4>
            <p className="text-[13px] text-white/60">or click to browse (.xlsx files only)</p>
            {fileName && (
              <div className="mt-3 text-sm font-semibold text-brand-blue">{fileName}</div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) handleFile(e.target.files[0]);
            }}
          />

          <button
            type="submit"
            disabled={!fileName || isUploading}
            className="w-full text-sm font-bold px-10 py-3.5 rounded-xl bg-brand-blue text-white hover:opacity-90 hover:-translate-y-px transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
          >
            {isUploading ? "Processing..." : "Upload & Process"}
          </button>
        </form>
      </div>
    </>
  );
}
