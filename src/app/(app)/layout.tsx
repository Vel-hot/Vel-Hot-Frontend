"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const updateTheme = () => {
      const saved = localStorage.getItem("velhot.settings.daltonien");
      if (saved === "true") {
        document.documentElement.classList.add("daltonien");
      } else {
        document.documentElement.classList.remove("daltonien");
      }
    };
    
    updateTheme();
    
    window.addEventListener("settings-updated", updateTheme);
    return () => {
      window.removeEventListener("settings-updated", updateTheme);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#d8dae0] gap-4">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-zinc-200 border-t-brand"></div>
          <div className="absolute grid h-10 w-10 place-items-center rounded-full bg-brand text-[10px] font-bold uppercase tracking-wide text-white animate-pulse">
            VH
          </div>
        </div>
        <p className="text-xs font-bold tracking-widest text-brand uppercase animate-pulse">
          Chargement de la session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#d8dae0]">
      <main className="relative flex h-full w-full overflow-hidden bg-[#dfe1e6]">
        <Sidebar />
        <section className="relative flex-1 overflow-hidden bg-[#d8dae0]">
          {children}
        </section>
      </main>
    </div>
  );
}

