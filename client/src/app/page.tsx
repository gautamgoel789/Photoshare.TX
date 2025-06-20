// HomePage.tsx - Modernized UI with Preview Modal and Animation

"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import PhotoList from "@/components/PhotoList";
import { AnimatePresence, motion } from "framer-motion";
import PreviewModal from "@/components/PreviewModal";

export default function HomePage() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [view, setView] = useState<"tiles" | "list" | "compact">("tiles");
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const fetchPhotos = () => {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    console.log("🌐 Fetching photos from:", apiUrl);

    fetch(`${apiUrl}/photos`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📸 Received photo URLs:", data);
        // Transform URLs for browser access
        const transformedData = data.map((url: string) =>
          url.replace("http://server:4000", "http://localhost:4000")
        );
        console.log("🔄 Transformed URLs:", transformedData);
        setPhotos(transformedData);
      })
      .catch((error) => {
        console.error("❌ Error fetching photos:", error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <main className="flex min-h-screen bg-neutral-900 text-white">
      <Sidebar onViewChange={setView} onUploadComplete={fetchPhotos} />

      <section className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Your Uploaded Photos</h1>
        {loading ? (
          <p className="text-white/60">Loading photos...</p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <PhotoList
                photos={photos}
                view={view}
                onPreview={(url) => setSelectedPhoto(url)}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      {selectedPhoto && (
        <PreviewModal
          url={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          open={false}
        />
      )}
    </main>
  );
}