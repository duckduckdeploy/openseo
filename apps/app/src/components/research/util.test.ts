import { describe, expect, it } from "vitest";
import { difficultyLevel, estimatedVisits } from "./util";

describe("keyword difficulty levels", () => {
  it("words and bands agree for the same rounded score", () => {
    expect(difficultyLevel(14.4)).toEqual({ score: 14, word: "Easy", band: "easy" });
    expect(difficultyLevel(29.6)).toEqual({ score: 30, word: "Medium", band: "medium" });
    expect(difficultyLevel(29.4)).toEqual({ score: 29, word: "Fairly easy", band: "easy" });
    expect(difficultyLevel(49)).toEqual({ score: 49, word: "Medium", band: "medium" });
    expect(difficultyLevel(50)).toEqual({ score: 50, word: "Hard", band: "hard" });
    expect(difficultyLevel(70)).toEqual({ score: 70, word: "Very hard", band: "hard" });
    expect(difficultyLevel(null)).toBeNull();
    expect(difficultyLevel(Number.NaN)).toBeNull();
  });
});

describe("estimated visits", () => {
  it("covers positions 1 to 100 with a decaying tail", () => {
    expect(estimatedVisits(1000, 1)).toBe(280);
    expect(estimatedVisits(1000, 10)).toBe(25);
    expect(estimatedVisits(10000, 11)).toBe(100);
    expect(estimatedVisits(10000, 100)).toBe(10);
    const tail = Array.from({ length: 90 }, (_, i) => estimatedVisits(1_000_000, i + 11) as number);
    expect(tail.every((visits, i) => i === 0 || visits < (tail[i - 1] as number))).toBe(true);
    expect(estimatedVisits(1000, 101)).toBeNull();
    expect(estimatedVisits(1000, 0)).toBeNull();
    expect(estimatedVisits(null, 3)).toBeNull();
  });
});
