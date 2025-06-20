"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadCloud, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import clsx from "clsx";

interface UploadFormProps {
  onUploadComplete?: () => void;
}

export default function UploadForm({ onUploadComplete }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (status === "success") {
      const timeout = setTimeout(() => setStatus("idle"), 2500);
      return () => clearTimeout(timeout);
    }
  }, [status]);

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setStatus("idle");
    setUploading(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setStatus("idle");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      const dropped = e.dataTransfer.files[0];
      setFile(dropped);
      setPreviewUrl(URL.createObjectURL(dropped));
      setStatus("idle");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setStatus("idle");

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      for (let i = 0; i <= 100; i += 10) {
        await new Promise((r) => setTimeout(r, 20));
        setUploadProgress(i);
      }

      setStatus("success");
      reset();
      onUploadComplete?.();
    } catch (err) {
      console.error("Upload error:", err);
      setStatus("error");
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 text-white">
      <Label className="text-sm font-semibold">Upload Photo</Label>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className={clsx(
          "w-full h-40 flex items-center justify-center text-sm cursor-pointer",
          "border border-dashed border-white/20 rounded-none bg-white/5 hover:bg-white/10 transition relative overflow-hidden"
        )}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="object-contain h-full w-full"
          />
        ) : (
          <p className="text-white/70">Drag & drop or click to select a file</p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {file && (
        <div className="text-xs text-white/80">
          <p><strong>Name:</strong> {file.name}</p>
          <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="flex-1 flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-none"
        >
          <UploadCloud className="h-4 w-4" />
          {uploading ? "Uploading..." : "Upload"}
        </Button>

        {(file || uploading) && (
          <Button
            variant="ghost"
            onClick={reset}
            className="flex items-center gap-2 text-red-400 hover:text-red-500 border border-red-400/20 rounded-none"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {uploading && (
        <div className="h-2 w-full bg-white/10 rounded-none overflow-hidden">
          <div
            className="h-full bg-white transition-all"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {status === "success" && (
        <div className="flex items-center text-green-400 text-sm gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Upload complete
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center text-red-400 text-sm gap-2">
          <XCircle className="w-4 h-4" />
          Upload failed
        </div>
      )}
    </div>
  );
}
