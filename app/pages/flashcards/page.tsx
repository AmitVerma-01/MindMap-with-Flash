import { getUsageStats } from "@/lib/data/credits";
import FlashcardsClient from "./FlashcardsClient";

export default async function FlashcardsPage() {
  const initialUsageStats = await getUsageStats();
  return <FlashcardsClient initialUsageStats={initialUsageStats} />;
}
