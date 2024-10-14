import { useState, useRef, useEffect } from "react";
import "./wordle.scss";
import Row from "@components/row/row";
import { LETTERS } from "@/constants/letters";
import { WORDS } from "@/constants/words";
import { checkWordExists } from '@/service/dictionaryService'

// const SOLUTION = WORDS[Math.floor(Math.random() * WORDS.length)];
const SOLUTION = "world";

export default function Wordle() {
  const [guesses, setGuesses] = useState<string[]>([
    "     ",
    "     ",
    "     ",
    "     ",
    "     ",
    "     ",
  ]);
  const [solutionFound, setSolutionFound] = useState(false);
  const [activeLetterIndex, setActiveLetterIndex] = useState(0);
  const [notification, setNotification] = useState("");
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const [failedGuesses, setFailedGuesses] = useState<string[]>([]);
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [presentLetters, setPresentLetters] = useState<string[]>([]);
  const [absentLetters, setAbsentLetters] = useState<string[]>([]);

  const wordleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wordleRef.current) {
      wordleRef.current.focus();
    }
  }, []);

  const typeLetter = (letter: string) => {
    if (activeLetterIndex < 5) {
      setNotification("");

      const newGuesses = [...guesses];
      newGuesses[activeRowIndex] = replaceCharacter(
        newGuesses[activeRowIndex],
        activeLetterIndex,
        letter
      );

      setGuesses(newGuesses);
      setActiveLetterIndex((index) => index + 1);
    }
  };

  const replaceCharacter = (str: string, index: number, replacement: string) => {
    return str.slice(0, index) + replacement + str.slice(index + 1);
  };

  const hitEnter = async () => {
    if (activeLetterIndex === 5) {
      const currentGuess = guesses[activeRowIndex].trim();

      const wordExists = await checkWordExists(currentGuess);

      if (!wordExists) {
        setNotification("NOT IN THE WORD LIST");
      } else if (failedGuesses.includes(currentGuess)) {
        setNotification("WORD TRIED ALREADY");
      } else if (currentGuess === SOLUTION) {
        setSolutionFound(true);
        setNotification("WELL DONE");
        setCorrectLetters([...SOLUTION]);
      } else {
        let newCorrectLetters: string[] = [];

        currentGuess.split("").forEach((letter, index) => {
          if (SOLUTION[index] === letter) newCorrectLetters.push(letter);
        });

        setCorrectLetters([...new Set([...correctLetters, ...newCorrectLetters])]);

        setPresentLetters([
          ...new Set([
            ...presentLetters,
            ...currentGuess.split("").filter((letter) => SOLUTION.includes(letter)),
          ]),
        ]);

        setAbsentLetters([
          ...new Set([
            ...absentLetters,
            ...currentGuess.split("").filter((letter) => !SOLUTION.includes(letter)),
          ]),
        ]);

        setFailedGuesses([...failedGuesses, currentGuess]);
        setActiveRowIndex((index) => index + 1);
        setActiveLetterIndex(0);
      }
    } else {
      setNotification("FIVE LETTER WORDS ONLY");
    }
  };

  const hitBackspace = () => {
    setNotification("");

    if (activeLetterIndex > 0) {
      const newGuesses = [...guesses];

      newGuesses[activeRowIndex] = replaceCharacter(
        newGuesses[activeRowIndex],
        activeLetterIndex - 1,
        " "
      );

      setGuesses(newGuesses);
      setActiveLetterIndex((index) => index - 1);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (solutionFound) return;

    if (LETTERS.includes(event.key)) {
      typeLetter(event.key);
      return;
    }

    if (event.key === "Enter") {
      hitEnter();
      return;
    }

    if (event.key === "Backspace") {
      hitBackspace();
    }
  };

  return (
    <div
      className="wordle"
      ref={wordleRef}
      tabIndex={0}
      onBlur={(e) => e.target.focus()}
      onKeyDown={handleKeyDown}
    >
      <h1 className="title">Wordle Clone</h1>
      <div className={`notification ${solutionFound ? "notification--green" : ""}`}>
        {notification}
      </div>
      {guesses.map((guess, index) => (
        <Row
          key={index}
          word={guess}
          presentLetters={presentLetters}
          correctLetters={correctLetters}
          absentLetters={absentLetters}
          applyRotation={
            activeRowIndex > index ||
            (solutionFound && activeRowIndex === index)
          }
          solution={SOLUTION}
          bounceOnError={
            notification !== "WELL DONE" &&
            notification !== "" &&
            activeRowIndex === index
          }
        />
      ))}
    </div>
  );
}
