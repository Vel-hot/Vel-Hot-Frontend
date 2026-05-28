import { HistoryDashboard } from "@/components/history/HistoryDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Historique - Vél'Hot",
  description: "Analyse historique du réseau Vél'Hot Lyon",
};

export default function HistoryPage() {
  return <HistoryDashboard />;
}
