"use client";

import PhotoTile from "./PhotoTile";
import PhotoListItem from "./PhotoListItem";

interface PhotoListProps {
  photos: string[];
  view: "tiles" | "list" | "compact";
  onPreview?: (url: string) => void; // ✅ Added prop
}

export default function PhotoList({ photos, view, onPreview }: PhotoListProps) {
  if (photos.length === 0) {
    return (
      <p className="text-white/40 text-sm italic">
        No photos found.
      </p>
    );
  }

  if (view === "list") {
    return (
      <div className="flex flex-col gap-2">
        {photos.map((url, idx) => (
          <PhotoListItem
            key={idx}
            url={url}
            onPreview={() => onPreview?.(url)} // ✅ Trigger preview
          />
        ))}
      </div>
    );
  }

  const gridCols =
    view === "compact"
      ? "grid-cols-2 md:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {photos.map((url, idx) => (
        <PhotoTile
          key={idx}
          url={url}
          onPreview={() => onPreview?.(url)} // ✅ Trigger preview
        />
      ))}
    </div>
  );
}
