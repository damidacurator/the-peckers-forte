import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import Link from "next/link";

export default function NewsPage() {
  const news = [
    {
      id: 1,
      title: "Dividend Declaration for 2023 Financial Year",
      excerpt: "The Board of Directors is pleased to announce a dividend payout of 15% for the 2023 financial year, demonstrating our strong portfolio performance.",
      date: "Jan 15, 2024",
      wing: "Investment Wing"
    },
    {
      id: 2,
      title: "New Loan Policy Takes Effect",
      excerpt: "Members can now access up to 200% of their savings as loans. This new policy is designed to provide greater financial flexibility for our members.",
      date: "Feb 02, 2024",
      wing: "Contribution Wing"
    },
    {
      id: 3,
      title: "Upcoming Annual General Meeting",
      excerpt: "Notice is hereby given that the Annual General Meeting of THE PECKERS FORTE will hold next month. All members are enjoined to attend.",
      date: "Mar 10, 2024",
      wing: "Both Wings"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-brand-bg">
      <div className="bg-brand-darkBlue py-20 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">News & Announcements</h1>
        <p className="text-lg text-brand-gold">Stay updated with the latest from the cooperative</p>
      </div>

      <div className="container mx-auto px-4 mt-16 max-w-4xl">
        <div className="space-y-6">
          {news.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {item.date}</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">{item.wing}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 hover:text-brand-blue">
                  <Link href={`/news/${item.id}`}>{item.title}</Link>
                </h3>
                <p className="text-gray-600 mb-4">{item.excerpt}</p>
                <Link href={`/news/${item.id}`} className="text-brand-blue font-semibold text-sm hover:underline">
                  Read More
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
