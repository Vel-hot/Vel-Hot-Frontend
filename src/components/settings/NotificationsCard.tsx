"use client";

import { Bell } from "lucide-react";
import { Toggle } from "@/components/ui/Toggle";

interface NotificationsCardProps {
  notifications: {
    push: boolean;
    email: boolean;
    system: boolean;
  };
  onToggle: (type: "push" | "email" | "system") => void;
}

export function NotificationsCard({ notifications, onToggle }: NotificationsCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-8 text-zinc-900 shadow-xl border border-zinc-100">
      <div className="mb-8 flex items-center gap-3">
        <Bell size={20} className="text-[#A61D24]" />
        <h3 className="text-lg font-bold">Notifications</h3>
      </div>

      <div className="relative">
        <div className="space-y-4 blur-sm select-none pointer-events-none">
          <NotificationItem
            title="Push Notifications"
            description="Alertes en temps réel sur mobile"
            active={notifications.push}
            onToggle={() => onToggle("push")}
          />
          <NotificationItem
            title="Email Alerts"
            description="Rapports de tendances hebdomadaires"
            active={notifications.email}
            onToggle={() => onToggle("email")}
          />
          <NotificationItem
            title="System Notifications"
            description="Mises à jour critiques de la plateforme"
            active={notifications.system}
            onToggle={() => onToggle("system")}
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-[#A61D24]/10 px-6 py-2 border border-[#A61D24]/20 backdrop-blur-md">
            <span className="text-sm font-black uppercase tracking-widest text-[#A61D24]">
              Work in Progress
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationItem({
  title,
  description,
  active,
  onToggle,
}: {
  title: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-zinc-50 p-6 transition-colors hover:bg-zinc-100">
      <div>
        <h4 className="font-bold text-zinc-800">{title}</h4>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
      <Toggle active={active} onToggle={onToggle} />
    </div>
  );
}
