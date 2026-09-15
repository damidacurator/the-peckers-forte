"use client";

import React from "react";
import { Newspaper } from "lucide-react";

export default function NewsPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20 bg-brand-bg">
      <div className="bg-brand-darkBlue py-20 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">News & Announcements</h1>
        <p className="text-lg text-brand-gold">Stay updated with the latest from the cooperative</p>
      </div>

      <div className="container mx-auto px-4 mt-16 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
            <Newspaper size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Announcements Yet</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Official announcements, notices, and updates will be published here as they become available.
          </p>
        </div>
      </div>
    </div>
  );
}
