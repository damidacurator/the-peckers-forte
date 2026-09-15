"use client";

import React from "react";
import { Calendar } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20 bg-brand-bg">
      <div className="bg-brand-darkBlue py-20 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
        <p className="text-lg text-brand-gold">Mark your calendars for our upcoming gatherings</p>
      </div>

      <div className="container mx-auto px-4 mt-16 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
            <Calendar size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Events</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Scheduled events, meetings, and seminars will be posted here as dates are finalized.
          </p>
        </div>
      </div>
    </div>
  );
}
