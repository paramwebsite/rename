import { useCallback } from "react";
import lettersData from "../data/letters.json";
const MAX_CHARS = 25;


export const getRandomLetterData = (letter, data) => {
  if (letter === " ") return null;
  const letterOptions = data[letter];
  if (!letterOptions) return null;
  return letterOptions[Math.floor(Math.random() * letterOptions.length)];
};

export const generateLettersForName = (inputName) => {
  const letters = inputName.toUpperCase().slice(0, MAX_CHARS).split("");
  const invalidLetters = letters.filter(
    (letter) => letter !== " " && !lettersData[letter],
  );

  if (invalidLetters.length > 0) {
    setError(
      "Some characters in your name are not available in the Landsat database.",
    );
    return null;
  }

  return letters.map((letter) => getRandomLetterData(letter, lettersData));
};
