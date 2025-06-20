"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Download } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
  filename?: string;
}

export default function PreviewModal({
  open,
  onClose,
  url,
  filename,
}: PreviewModalProps) {
  const displayName = filename ?? url.split("/").pop();

  // Rewrite 'server' to 'localhost' for browser access
  const browserUrl = url.replace('http://server:4000', 'http://localhost:4000');

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = browserUrl;
    link.download = displayName ?? "image.jpg";
    link.click();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
        <Dialog.Content
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 p-6 text-white"
        >
          {/* Close Button */}
          <Dialog.Close asChild>
            <button className="absolute top-6 right-6 text-white hover:text-gray-300 transition">
              <X className="w-6 h-6" />
            </button>
          </Dialog.Close>

          {/* Image Preview */}
          <div className="max-w-[90vw] max-h-[80vh] overflow-hidden">
            <Image
              src={browserUrl}
              alt={displayName ?? "Preview"}
              width={1200}
              height={800}
              className="w-full h-auto object-contain rounded"
            />
          </div>

          {/* Footer: filename + download */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-white/70 max-w-[80vw] truncate">
              {displayName}
            </p>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 rounded"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
