export interface FeatureItem {
  heading: string;
  details: string;
}

export const featureItems: FeatureItem[] = [
  {
    heading: "AI-Generated Flashcards",
    details:
      "Enter any topic and get comprehensive question-and-answer flashcards created instantly by AI.",
  },
  {
    heading: "Spaced Repetition",
    details:
      "Review cards at optimal intervals with SRS study mode to maximize long-term retention.",
  },
  {
    heading: "Visual Mind Mapping",
    details:
      "Create mind maps from topics or existing decks to visualize how concepts connect.",
  },
  {
    heading: "Customizable Difficulty",
    details:
      "Choose beginner, intermediate, or advanced levels and control how many cards to generate.",
  },
  {
    heading: "Save & Organize Sets",
    details:
      "Save flashcard sets, search your library, duplicate decks, and export to CSV or JSON.",
  },
  {
    heading: "Self-Grading Study Mode",
    details:
      "Flip cards, rate your recall, and track due and new cards from your dashboard.",
  },
];
