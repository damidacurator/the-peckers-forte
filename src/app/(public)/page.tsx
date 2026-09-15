import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, ShieldCheck, ArrowRight, Wallet, LineChart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-darkBlue via-brand-blue to-brand-green">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
          <div className="h-32 w-32 md:h-40 md:w-40 rounded-full bg-white p-2 mb-8 shadow-2xl animate-in zoom-in duration-700">
            <img src="/images/logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
            THE PECKERS FORTE
          </h1>
          <h2 className="text-xl md:text-3xl font-medium text-brand-gold mb-6 drop-shadow-md">
            Two Wings • One Vision
          </h2>
          <p className="max-w-2xl text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
            Building a secure financial future through collective contribution and strategic investments. 
            Join our cooperative today and experience the power of growing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="gold" className="w-full text-lg h-14 px-8 font-semibold shadow-lg hover:shadow-xl transition-all">
                Join Our Cooperative
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full text-lg h-14 px-8 font-semibold text-brand-darkBlue bg-white hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all">
                Member Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* TWO WINGS SECTION */}
      <section className="py-20 bg-brand-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Two Wings</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the two pillars of THE PECKERS FORTE designed to empower our members and secure their financial future.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Contribution Wing */}
            <Card className="overflow-hidden border-0 shadow-xl group hover:shadow-2xl transition-all duration-300">
              <div className="h-2 bg-brand-blue w-full" />
              <CardContent className="p-8">
                <div className="h-16 w-16 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Wallet size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Contribution Wing</h3>
                <h4 className="text-md font-semibold text-brand-blue mb-2">Premier Multipurpose Cooperative Society</h4>
                <p className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">People • Community • Impact</p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our contribution wing focuses on building community welfare through collective savings, monthly contributions, and mutual aid. Together, we create a safety net that empowers every member to achieve their personal goals.
                </p>
                <Link href="/about" className="inline-flex items-center text-brand-blue font-semibold hover:gap-2 transition-all">
                  Learn more <ArrowRight size={16} className="ml-1" />
                </Link>
              </CardContent>
            </Card>

            {/* Investment Wing */}
            <Card className="overflow-hidden border-0 shadow-xl group hover:shadow-2xl transition-all duration-300">
              <div className="h-2 bg-brand-green w-full" />
              <CardContent className="p-8">
                <div className="h-16 w-16 rounded-2xl bg-green-50 text-brand-green flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <LineChart size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Investment Wing</h3>
                <h4 className="text-md font-semibold text-brand-green mb-2">Premier Alliance Portfolio</h4>
                <p className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Capital • Growth • Prosperity</p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our investment wing channels pooled resources into strategic investments, creating wealth and securing financial prosperity for all members through smart portfolio management and wealth generation strategies.
                </p>
                <Link href="/about" className="inline-flex items-center text-brand-green font-semibold hover:gap-2 transition-all">
                  Learn more <ArrowRight size={16} className="ml-1" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center mb-6 shadow-sm">
                <Users size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3">Strong Community</h3>
              <p className="text-gray-600 text-center">Join a network of like-minded individuals dedicated to collective financial empowerment and mutual support.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-green-50 text-brand-green flex items-center justify-center mb-6 shadow-sm">
                <TrendingUp size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3">Steady Growth</h3>
              <p className="text-gray-600 text-center">Watch your wealth grow through our strategic investment portfolios and consistent dividend payouts.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-amber-50 text-brand-gold flex items-center justify-center mb-6 shadow-sm">
                <ShieldCheck size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Transparency</h3>
              <p className="text-gray-600 text-center">Access your ledger, track payments, and view real-time financial statements through your personal dashboard.</p>
            </div>
          </div>
        </div>
      </section>


      {/* HOW IT WORKS */}
      <section className="py-20 bg-brand-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Your journey to financial freedom is just four steps away.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { step: "01", title: "Register", desc: "Create an account and choose your preferred membership wing." },
              { step: "02", title: "Get Approved", desc: "Our board reviews your application and grants access to the portal." },
              { step: "03", title: "Contribute", desc: "Make your monthly contributions or investment deposits securely." },
              { step: "04", title: "Grow Together", desc: "Track your growth, access loans, and earn dividends on investments." }
            ].map((s, i) => (
              <div key={i} className="relative flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-5xl font-extrabold text-gray-100 absolute -top-4 -right-2 z-0">{s.step}</div>
                <div className="relative z-10">
                  <div className="h-12 w-12 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-lg mb-4 mx-auto">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-gradient-to-r from-[#C49A2A] to-[#D4A843] text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to join THE PECKERS FORTE?</h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Take the first step towards a secured financial future today.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-[#C49A2A] hover:bg-gray-100 text-lg h-14 px-10 font-bold shadow-xl">
              Register Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
