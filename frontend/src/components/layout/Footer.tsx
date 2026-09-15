import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Globe, MessageCircle, Camera } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-white p-1">
                <img src="/images/logo.jpg" alt="Logo" className="h-full w-full object-contain rounded-full" />
              </div>
              <h3 className="text-xl font-bold text-white">THE PECKERS FORTE</h3>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Building a secure financial future through collective contribution and strategic investments.
            </p>
            <p className="text-sm font-semibold text-brand-gold">Two Wings • One Vision</p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-white"><Globe size={20} /></a>
              <a href="#" className="hover:text-white"><MessageCircle size={20} /></a>
              <a href="#" className="hover:text-white"><Camera size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-brand-gold transition-colors">About Us</Link></li>
              <li><Link href="/executives" className="hover:text-brand-gold transition-colors">Executives</Link></li>
              <li><Link href="/gallery" className="hover:text-brand-gold transition-colors">Gallery</Link></li>
              <li><Link href="/news" className="hover:text-brand-gold transition-colors">News</Link></li>
              <li><Link href="/events" className="hover:text-brand-gold transition-colors">Events</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Our Wings</h4>
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-semibold text-brand-blue pb-1">Contribution Wing</h5>
                <p className="text-xs text-slate-400">Premier Multipurpose Cooperative Society</p>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-brand-green pb-1">Investment Wing</h5>
                <p className="text-xs text-slate-400">Premier Alliance Portfolio</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-gold shrink-0 mt-0.5" />
                <span>123 Cooperative Way, Victoria Island, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-gold shrink-0" />
                <span>+234 800 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-gold shrink-0" />
                <span>info@thepeckersforte.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="border-t border-slate-800 bg-[#0B1120] py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>Copyright © {new Date().getFullYear()} THE PECKERS FORTE. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
