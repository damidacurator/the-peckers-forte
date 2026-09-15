"use client";

import React from "react";
import { Plus } from "lucide-react";

export default function GalleryPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20 bg-brand-bg">
      <div className="bg-brand-darkBlue py-20 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Gallery</h1>
        <p className="text-lg text-brand-gold">Photo memories and milestones</p>
      </div>

      <div className="container mx-auto px-4 mt-16 max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Plus card to add photos later */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl aspect-[4/3] flex flex-col items-center justify-center p-6 text-center hover:border-brand-blue/50 hover:bg-blue-50/20 transition-all cursor-pointer group bg-white">
            <div className="h-16 w-16 rounded-full bg-slate-100 group-hover:bg-brand-blue/10 flex items-center justify-center text-gray-400 group-hover:text-brand-blue transition-colors mb-3">
              <Plus size={32} />
            </div>
            <h3 className="font-semibold text-gray-700 group-hover:text-brand-blue">Add Photos / Album</h3>
            <p className="text-xs text-gray-400 mt-1">Photos will appear here once uploaded</p>
          </div>
        </div>
      </div>
    </div>
  );
}
