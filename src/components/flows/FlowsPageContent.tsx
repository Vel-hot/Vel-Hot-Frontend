"use client";

import { FlowHeader } from "@/components/flows/FlowHeader";
import { TopFlowsSection } from "@/components/flows/TopFlowsSection";
import { ConnectionsTable } from "@/components/flows/ConnectionsTable";

export default function FlowsPageContent() {
  return (
    <div className="h-full overflow-y-auto bg-[#f8f9fb] p-12">
      <div className="mx-auto max-w-7xl">
        <FlowHeader />
        <TopFlowsSection />
        <ConnectionsTable />
      </div>
    </div>
  );
}
