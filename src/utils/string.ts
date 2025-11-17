import tnthai from "tnthai";
import BAD_WORDS from "../data/badWords.json" with { type: "json" };

export const badWordReplace = (text: string) => {
  const analyzer = new tnthai();
  const words = analyzer.segmenting(text).solution;

  return words
    .map((word: string) =>
      BAD_WORDS.includes(word) ? "***" : word
    )
    .join("");
};
