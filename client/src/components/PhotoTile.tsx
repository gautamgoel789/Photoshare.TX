"use client";

import Image from "next/image";
import { Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PhotoTileProps {
  url: string;
  filename?: string;
  onPreview?: () => void;
  onDownload?: () => void;
}

export default function PhotoTile({
  url,
  filename,
  onPreview,
  onDownload,
}: PhotoTileProps) {
  const [imageError, setImageError] = useState(false);
  const displayName = filename ?? url.split("/").pop();

  return (
    <div className="space-y-1">
      {/* Image with light background */}
      <div className="bg-white/5 overflow-hidden">
        {!imageError ? (
          <Image
            src={url}
            alt={displayName ?? "Photo"}
            width={400}
            height={300}
            className="w-full h-64 object-cover"
            onError={() => setImageError(true)}
            unoptimized // Try this if images still don't load
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center text-white/50">
            Error loading image
          </div>
        )}
      </div>

      {/* Filename and Actions */}
      <div className="flex items-center justify-between text-sm text-white/80">
        <span className="truncate max-w-[60%]">{displayName}</span>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={onPreview}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-none"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onDownload}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-none"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
