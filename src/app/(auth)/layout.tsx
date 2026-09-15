import React from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-brand-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link href="/">
          <div className="h-20 w-20 mx-auto overflow-hidden rounded-full bg-white p-1 shadow-md mb-4 inline-block">
            <img src="/images/logo.jpg" alt="Logo" className="h-full w-full object-contain rounded-full" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">THE PECKERS FORTE</h2>
        </Link>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}
