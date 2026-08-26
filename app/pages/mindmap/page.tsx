import { getFlashcardSetOptions } from "@/lib/data/dashboard";
import MindMapClient from "./MindMapClient";

export default async function MindMapPage() {
  const initialSets = await getFlashcardSetOptions();
  return <MindMapClient initialSets={initialSets} />;
}
