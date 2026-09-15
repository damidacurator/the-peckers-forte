import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock } from "lucide-react";

export default function EventsPage() {
  const events = [
    {
      id: 1,
      title: "2024 Annual General Meeting",
      date: "APR",
      day: "15",
      time: "10:00 AM",
      location: "Lagos Chamber of Commerce",
      description: "Join us for our Annual General Meeting where we will discuss the financial report for 2023, elect new board members, and share our strategic vision for the upcoming year."
    },
    {
      id: 2,
      title: "Wealth Creation Seminar",
      date: "MAY",
      day: "22",
      time: "02:00 PM",
      location: "Virtual (Zoom)",
      description: "An exclusive seminar for Investment Wing members on navigating real estate investments in Nigeria."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-brand-bg">
      <div className="bg-brand-darkBlue py-20 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
        <p className="text-lg text-brand-gold">Mark your calendars for our upcoming gatherings</p>
      </div>

      <div className="container mx-auto px-4 mt-16 max-w-4xl">
        <div className="space-y-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden border-0 shadow-md">
              <div className="flex flex-col md:flex-row">
                <div className="bg-brand-blue text-white p-6 flex flex-col items-center justify-center md:w-48 shrink-0">
                  <span className="text-lg font-medium">{event.date}</span>
                  <span className="text-5xl font-bold">{event.day}</span>
                </div>
                <CardContent className="p-6 md:p-8 flex-1">
                  <h3 className="text-2xl font-bold mb-4">{event.title}</h3>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-2"><Clock size={16} /> {event.time}</span>
                    <span className="flex items-center gap-2"><MapPin size={16} /> {event.location}</span>
                  </div>
                  <p className="text-gray-600">{event.description}</p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
