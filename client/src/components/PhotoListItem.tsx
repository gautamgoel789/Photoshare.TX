"use client";

import Image from "next/image";
import { Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PhotoListItemProps {
  url: string;
  filename?: string;
  onPreview?: () => void;
  onDownload?: () => void;
}

export default function PhotoListItem({
  url,
  filename,
  onPreview,
  onDownload,
}: PhotoListItemProps) {
  const [imageError, setImageError] = useState(false);
  const displayName = filename ?? url.split("/").pop();

  return (
    <div className="flex items-center justify-between p-3 gap-4 bg-white/5 text-white rounded-none">
      {/* Thumbnail & Name */}
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden bg-white/10">
          {!imageError ? (
            <Image
              src={url}
              alt={displayName ?? "Photo"}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              unoptimized // Try this if images still don't load
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-white/50">
              Error loading
            </div>
          )}
        </div>
        <div className="text-sm text-white/80 truncate max-w-[200px]">
          {displayName}
        </div>
      </div>

      {/* Actions */}
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
  );
}
