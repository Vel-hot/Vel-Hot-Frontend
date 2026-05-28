import { Pencil } from "lucide-react";

export function ProfileCard() {
  return (
    <div className="rounded-3xl bg-white p-8 text-center text-zinc-900 shadow-xl">
      <div className="relative mx-auto mb-6 h-32 w-32">
        <div className="h-full w-full overflow-hidden rounded-full border-4 border-zinc-100 bg-zinc-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200"
            alt="Julien Durand"
            className="h-full w-full object-cover"
          />
        </div>
        <button className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full bg-[#A61D24] text-white shadow-md transition-transform hover:scale-110">
          <Pencil size={14} />
        </button>
      </div>
      <h2 className="text-2xl font-bold text-zinc-800">Julien Durand</h2>
      <p className="text-sm font-medium text-zinc-500">Analyste Principal</p>

      <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-6 text-[10px] font-bold tracking-wider text-zinc-400">
        <span>ID: VH-9921</span>
        <span>LYON, FR</span>
      </div>
    </div>
  );
}
