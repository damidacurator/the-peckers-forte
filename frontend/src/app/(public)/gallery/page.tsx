import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";

export default function GalleryPage() {
  const albums = [
    { id: 1, title: "AGM 2023", date: "Dec 15, 2023", count: 24 },
    { id: 2, title: "Investment Seminar", date: "Sep 20, 2023", count: 15 },
    { id: 3, title: "Cooperative Week", date: "Jul 10, 2023", count: 42 },
    { id: 4, title: "End of Year Gala", date: "Dec 20, 2022", count: 30 },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-brand-bg">
      <div className="bg-brand-darkBlue py-20 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Gallery</h1>
        <p className="text-lg text-brand-gold">Memories from THE PECKERS FORTE events</p>
      </div>

      <div className="container mx-auto px-4 mt-16 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {albums.map((album) => (
            <Card key={album.id} className="overflow-hidden cursor-pointer group hover:shadow-xl transition-shadow">
              <div className="aspect-[4/3] bg-gray-200 relative flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-gray-400 group-hover:scale-110 transition-transform" />
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {album.count} photos
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{album.title}</h3>
                <p className="text-sm text-gray-500">{album.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
