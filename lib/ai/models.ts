export const DEFAULT_FALLBACK_MODELS = [
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "poolside/laguna-s-2.1:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "z-ai/glm-5.2:free",
] as const;

export function getModelChain(): string[] {
  const chain = DEFAULT_FALLBACK_MODELS

  return [...new Set(chain)];
}

export function getModelDisplayName(modelId: string): string {
  const name = modelId.split("/").pop()?.split(":")[0] ?? modelId;
  return name.replace(/-/g, " ");
}
