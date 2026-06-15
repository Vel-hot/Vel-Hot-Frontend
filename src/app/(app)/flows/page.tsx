import FlowsPageContent from "@/components/flows/FlowsPageContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analyse de Flux - Vél'Hot",
  description: "Analyse prédictive des flux de trajets Lyon Velo'v",
};

export default function FlowsPage() {
  return <FlowsPageContent />;
}
