import type { Flashcard } from "@/types/flashcard";

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function flashcardsToCsv(cards: Flashcard[]): string {
  const headers = [
    "front",
    "back",
    "hint",
    "difficulty",
    "category",
    "mnemonic",
  ];
  const rows = cards.map((card) =>
    [
      card.front,
      card.back,
      card.hint ?? "",
      card.difficulty ?? "",
      card.category ?? "",
      card.mnemonic ?? "",
    ]
      .map(escapeCsv)
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

export function downloadTextFile(
  content: string,
  filename: string,
  mimeType = "text/plain;charset=utf-8"
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function flashcardsToAnkiCsv(cards: Flashcard[]): string {
  const rows = cards.map((card) => {
    const front = card.hint
      ? `${card.front}<br><br><i>Hint: ${card.hint}</i>`
      : card.front;
    const back = card.mnemonic
      ? `${card.back}<br><br>💡 ${card.mnemonic}`
      : card.back;
    return [escapeCsv(front), escapeCsv(back)].join(",");
  });
  return rows.join("\n");
}
