"use client";

import React, { useState } from "react";
import { Save } from "lucide-react";
import { ProfileCard } from "@/components/settings/ProfileCard";
import { AccessibilityCard } from "@/components/settings/AccessibilityCard";
import { NotificationsCard } from "@/components/settings/NotificationsCard";
import { WebhooksCard } from "@/components/settings/WebhooksCard";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    system: true,
  });

  const [daltonien, setDaltonien] = useState(true);

  const handleNotificationToggle = (type: "push" | "email" | "system") => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="h-full overflow-y-auto bg-[#0a0a0a] p-12 text-zinc-400">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white opacity-80">Paramètres du compte</h1>
          <p className="mt-2 text-zinc-500">Gérez vos préférences de prédiction et d&apos;interface.</p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column */}
          <div className="space-y-8 lg:col-span-4">
            <ProfileCard />
            <AccessibilityCard active={daltonien} onToggle={() => setDaltonien(!daltonien)} />
          </div>

          {/* Right Column */}
          <div className="space-y-8 lg:col-span-8">
            <NotificationsCard
              notifications={notifications}
              onToggle={handleNotificationToggle}
            />
            <WebhooksCard />
          </div>
        </div>

        {/* Footer Actions */}
        <footer className="mt-12 flex items-center justify-end gap-6">
          <button className="text-sm font-bold text-zinc-500 hover:text-zinc-300">Annuler</button>
          <button className="flex items-center gap-2 rounded-xl bg-[#A61D24] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-red-900/20 transition-transform hover:scale-105 active:scale-95">
            <Save size={18} />
            Sauvegarder les modifications
          </button>
        </footer>
      </div>
    </div>
  );
}
