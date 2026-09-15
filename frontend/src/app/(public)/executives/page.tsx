"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const executives = [
  { id: 1, name: "Oluwadamilare Idowu", position: "President", wing: "BOTH", image: "/images/placeholder.jpg" },
  { id: 2, name: "Adeola Ogunleye", position: "Vice President", wing: "CONTRIBUTION", image: "/images/placeholder.jpg" },
  { id: 3, name: "Chukwudi Eze", position: "Investment Director", wing: "INVESTMENT", image: "/images/placeholder.jpg" },
  { id: 4, name: "Fatima Bello", position: "Treasurer", wing: "BOTH", image: "/images/placeholder.jpg" },
  { id: 5, name: "Oluwafemi Adebayo", position: "Secretary", wing: "CONTRIBUTION", image: "/images/placeholder.jpg" },
];

export default function ExecutivesPage() {
  const [filter, setFilter] = useState("ALL");

  const filteredExcos = executives.filter(
    (exco) => filter === "ALL" || exco.wing === filter || exco.wing === "BOTH"
  );

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-brand-bg">
      <div className="bg-brand-darkBlue py-20 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Our Executives</h1>
        <p className="text-lg text-brand-gold">Meet the leaders driving THE PECKERS FORTE vision</p>
      </div>

      <div className="container mx-auto px-4 mt-12 max-w-6xl">
        <div className="flex justify-center mb-12">
          <Tabs defaultValue="ALL" className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ALL" onClick={() => setFilter("ALL")}>All</TabsTrigger>
              <TabsTrigger value="CONTRIBUTION" onClick={() => setFilter("CONTRIBUTION")}>Contribution</TabsTrigger>
              <TabsTrigger value="INVESTMENT" onClick={() => setFilter("INVESTMENT")}>Investment</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredExcos.map((exco) => (
            <Card key={exco.id} className="overflow-hidden border-0 shadow-lg text-center group">
              <div className="aspect-square bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-blue flex items-center justify-center text-white opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="text-4xl font-bold">{exco.name[0]}</span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-1">{exco.name}</h3>
                <p className="text-brand-gold font-medium mb-2">{exco.position}</p>
                <div className="text-xs text-gray-500 bg-gray-100 inline-block px-2 py-1 rounded-full uppercase tracking-wider">
                  {exco.wing === "BOTH" ? "Both Wings" : exco.wing === "CONTRIBUTION" ? "Contribution Wing" : "Investment Wing"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
