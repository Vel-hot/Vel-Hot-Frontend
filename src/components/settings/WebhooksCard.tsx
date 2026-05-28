"use client";

import { Globe, MessageSquare, Plus, ShieldCheck, Trash2 } from "lucide-react";

export function WebhooksCard() {
  return (
    <div className="rounded-3xl bg-white p-8 text-zinc-900 shadow-xl">
      <div className="mb-8 flex items-center gap-3">
        <ShieldCheck size={20} className="text-[#A61D24]" />
        <h3 className="text-lg font-bold">Webhooks</h3>
      </div>

      <div className="space-y-6">
        <WebhookInput
          label="Discord Webhook URL"
          icon={<Globe size={16} />}
          value="https://discord.com/api/webhooks/..."
        />
        <WebhookInput
          label="Telegram Webhook URL"
          icon={<MessageSquare size={16} />}
          value="https://api.telegram.org/bot..."
        />

        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-200 py-4 text-sm font-bold text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-700">
          <Plus size={18} />
          Ajouter un webhook
        </button>
      </div>
    </div>
  );
}

function WebhookInput({
  label,
  icon,
  value,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
        {label}
      </label>
      <div className="flex gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-xl bg-zinc-50 px-4 py-3 text-zinc-600">
          <div className="text-zinc-400">{icon}</div>
          <input
            type="text"
            readOnly
            value={value}
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </div>
        <button className="grid h-12 w-12 place-items-center rounded-xl bg-zinc-100 text-zinc-500 transition-colors hover:bg-zinc-200">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
