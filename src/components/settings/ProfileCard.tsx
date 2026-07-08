"use client";

import { Pencil } from "lucide-react";

import Link from "next/link";

import { useAuth } from "@/components/auth/AuthProvider";

export function ProfileCard() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="rounded-3xl bg-white p-8 text-center text-zinc-900 shadow-xl">
      <div className="relative mx-auto mb-6 h-32 w-32">
        <div className="h-full w-full overflow-hidden rounded-full border-4 border-zinc-100 bg-zinc-200">
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#A61D24] to-[#d95b61] text-3xl font-bold text-white">
            {isAuthenticated && user ? `${user.prenom?.[0] ?? "V"}${user.nom?.[0] ?? "H"}` : "VH"}
          </div>
        </div>
        <button className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full bg-[#A61D24] text-white shadow-md transition-transform hover:scale-110">
          <Pencil size={14} />
        </button>
      </div>

      {isAuthenticated && user ? (
        <>
          <h2 className="text-2xl font-bold text-zinc-800">{user.prenom} {user.nom}</h2>
          <p className="mt-2 text-sm text-zinc-500">{user.email}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#A61D24]">{user.role}</p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-zinc-800">Compte non connecté</h2>
          <p className="mt-2 text-sm text-zinc-500">Connectez-vous pour afficher les informations utilisateur.</p>
          <div className="mt-4 flex items-center justify-center gap-3 text-sm font-semibold">
            <Link href="/login" className="text-[#A61D24] hover:underline">Connexion</Link>
            <span className="text-zinc-300">•</span>
            <Link href="/register" className="text-[#A61D24] hover:underline">Inscription</Link>
          </div>
        </>
      )}

      <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-6 text-[10px] font-bold tracking-wider text-zinc-400">
        <span>ID: {isAuthenticated && user ? `VH-${user.id}` : "VH-TEMP"}</span>
        <span>LYON, FR</span>
      </div>
    </div>
  );
}
