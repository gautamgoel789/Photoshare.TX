"use client";

import UploadForm from "./UploadForm";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { LayoutGrid, List, Rows } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  onViewChange: (view: "tiles" | "list" | "compact") => void;
  onUploadComplete?: () => void;
}

export default function Sidebar({
  onViewChange,
  onUploadComplete,
}: SidebarProps) {
  const [activeView, setActiveView] = useState<"tiles" | "list" | "compact">(
    "tiles"
  );

  const viewOptions: Array<{ icon: React.ElementType; mode: "tiles" | "list" | "compact" }> = [
    { icon: LayoutGrid, mode: "tiles" },
    { icon: List, mode: "list" },
    { icon: Rows, mode: "compact" },
  ];

  const handleViewChange = (mode: "tiles" | "list" | "compact") => {
    setActiveView(mode);
    onViewChange(mode);
  };

  return (
    <aside
      className="w-80 h-screen sticky top-0 p-6 flex flex-col gap-6 
      bg-black text-white border-r border-white/10 shadow-xl rounded-none z-10"
    >
      {/* Header */}
      <h2 className="text-2xl font-bold tracking-tight">Upload</h2>

      {/* Upload Form */}
      <UploadForm onUploadComplete={onUploadComplete} />

      {/* View Toggle */}
      <div>
        <Label className="mb-2 block text-sm font-semibold text-white">
          View Mode
        </Label>
        <div className="flex gap-2">
          {viewOptions.map(({ icon: Icon, mode }) => (
            <Button
              key={mode}
              variant="ghost"
              onClick={() => handleViewChange(mode)}
              className={`w-10 h-10 p-0 flex items-center justify-center border rounded-none transition
                ${
                  activeView === mode
                    ? "bg-white/20 border-white/30"
                    : "bg-white/5 hover:bg-white/10 border-white/10"
                }`}
              title={`Switch to ${mode} view`}
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>
    </aside>
  );
}
