import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-red-600">Vél&apos;Hot</h1>
          <p className="text-gray-500 text-sm mt-1">Plateforme intelligente Vélo&apos;v</p>
        </div>
        {children}
      </div>
    </div>
  );
}
