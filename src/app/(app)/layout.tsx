import { Sidebar } from "@/components/Sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
