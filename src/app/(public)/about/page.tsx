import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="bg-brand-darkBlue py-20 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-brand-gold">Discover the vision behind THE PECKERS FORTE</p>
      </div>

      <div className="container mx-auto px-4 mt-16 max-w-4xl">
        <section className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            THE PECKERS FORTE is a dynamic organization operating through two distinct wings designed to cater to the diverse financial needs of our members. Our structure ensures that whether you are looking for a community-driven safety net or aggressive wealth generation, there is a place for you here.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-t-4 border-t-brand-blue shadow-md">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4 text-brand-blue">Our Mission</h3>
              <p className="text-gray-600">
                To empower our members by providing a transparent, reliable, and highly rewarding platform for collective savings, cooperative support, and strategic investments.
              </p>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-brand-green shadow-md">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4 text-brand-green">Our Vision</h3>
              <p className="text-gray-600">
                To be the foremost cooperative and investment society in Africa, known for transforming lives and building generational wealth for our members.
              </p>
            </CardContent>
          </Card>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {["Transparency", "Integrity", "Community", "Growth"].map((val, i) => (
              <div key={i} className="bg-brand-bg rounded-lg p-6 text-center border border-gray-100">
                <h4 className="font-bold text-lg text-brand-darkBlue">{val}</h4>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
