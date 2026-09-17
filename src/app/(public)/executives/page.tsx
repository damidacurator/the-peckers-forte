"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const executives = [
  { 
    id: 1, 
    name: "Akinola Idowu", 
    position: "President", 
    wing: "BOTH",
    image: "/images/executives/akinola-idowu-square.png"
  },
  { 
    id: 2, 
    name: "Oyindamola Idowu", 
    position: "Second Lead Developer", 
    wing: "BOTH",
    image: "/images/executives/oyindamola-idowu-square.png"
  },
  { 
    id: 3, 
    name: "Oluwadamilare Idowu", 
    position: "Lead Developer", 
    wing: "BOTH",
    image: "/images/executives/oluwadamilare-idowu.png"
  },
];

export default function ExecutivesPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20 bg-brand-bg">
      <div className="bg-brand-darkBlue py-20 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Our Executives</h1>
        <p className="text-lg text-brand-gold">Leadership of THE PECKERS FORTE</p>
      </div>

      <div className="container mx-auto px-4 mt-12 max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {executives.map((exco) => (
            <Card key={exco.id} className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 text-center group bg-white rounded-2xl flex flex-col">
              <div className="aspect-square bg-slate-100 relative overflow-hidden flex items-center justify-center border-b">
                {exco.image ? (
                  <img
                    src={exco.image}
                    alt={exco.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="h-28 w-28 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-4xl shadow-inner">
                    {exco.name.split(" ").map(n => n[0]).join("")}
                  </div>
                )}
              </div>
              <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-brand-blue transition-colors">{exco.name}</h3>
                  <p className="text-brand-gold font-semibold mb-3">{exco.position}</p>
                </div>
                <div>
                  <div className="text-xs text-gray-600 bg-gray-100 inline-block px-3 py-1 rounded-full uppercase tracking-wider font-medium">
                    Two Wings
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
