import { notFound } from "next/navigation";
import { getMindMapById } from "@/lib/data/mindmap";
import MindMapViewerClient from "./MindMapViewerClient";

export default async function MindMapViewerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mindMap = await getMindMapById(id);

  if (!mindMap) {
    notFound();
  }

  return <MindMapViewerClient mindMap={mindMap} />;
}
