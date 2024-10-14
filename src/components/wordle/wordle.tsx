import { useState, useRef, useEffect } from 'react'
import './wordle.scss'
import Row from '@components/row/row'
import { LETTERS } from '@/constants/letters'
import { checkWordExists } from '@/service/dictionaryService'
import Keyboard from '@components/keyboard/keyboard'

// const SOLUTION = WORDS[Math.floor(Math.random() * WORDS.length)];
const SOLUTION = 'world'

export default function Wordle() {
  const [guesses, setGuesses] = useState<string[]>([
    '     ',
    '     ',
    '     ',
    '     ',
    '     ',
    '     ',
  ])
  const [solutionFound, setSolutionFound] = useState(false)
  const [activeLetterIndex, setActiveLetterIndex] = useState(0)
  const [notification, setNotification] = useState('')
  const [activeRowIndex, setActiveRowIndex] = useState(0)
  const [failedGuesses, setFailedGuesses] = useState<string[]>([])
  const [correctLetters, setCorrectLetters] = useState<string[]>([])
  const [presentLetters, setPresentLetters] = useState<string[]>([])
  const [absentLetters, setAbsentLetters] = useState<string[]>([])

  const wordleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (wordleRef.current) {
      wordleRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('');
      }, 2000);

      return () => clearTimeout(timer); 
    }
  }, [notification]);

  const typeLetter = (letter: string) => {
    if (activeLetterIndex < 5) {
      setNotification('')

      const newGuesses = [...guesses]
      newGuesses[activeRowIndex] = replaceCharacter(
        newGuesses[activeRowIndex],
        activeLetterIndex,
        letter
      )

      setGuesses(newGuesses)
      setActiveLetterIndex((index) => index + 1)
    }
  };

  const replaceCharacter = (
    str: string,
    index: number,
    replacement: string
  ) => {
    return str.slice(0, index) + replacement + str.slice(index + 1)
  }

  const hitEnter = async () => {
    if (activeLetterIndex === 5) {
      const currentGuess = guesses[activeRowIndex].trim()

      const wordExists = await checkWordExists(currentGuess)

      if (!wordExists) {
        setNotification('단어를 찾을 수 없습니다')
      } else if (failedGuesses.includes(currentGuess)) {
        setNotification('이미 시도한 단어입니다')
      } else if (currentGuess === SOLUTION) {
        setSolutionFound(true);
        setNotification('정답입니다!');
        setCorrectLetters([...SOLUTION]);
      } else {
        let newCorrectLetters: string[] = [];

        currentGuess.split('').forEach((letter, index) => {
          if (SOLUTION[index] === letter) newCorrectLetters.push(letter);
        })

        setCorrectLetters([
          ...new Set([...correctLetters, ...newCorrectLetters]),
        ])

        setPresentLetters([
          ...new Set([
            ...presentLetters,
            ...currentGuess
              .split('')
              .filter((letter) => SOLUTION.includes(letter)),
          ]),
        ])

        setAbsentLetters([
          ...new Set([
            ...absentLetters,
            ...currentGuess
              .split('')
              .filter((letter) => !SOLUTION.includes(letter)),
          ]),
        ])

        setFailedGuesses([...failedGuesses, currentGuess]);
        setActiveRowIndex((index) => index + 1);
        setActiveLetterIndex(0);
      }
    } else {
      setNotification('5글자가 아닙니다');
    }
  }

  const hitBackspace = () => {
    setNotification('');

    if (activeLetterIndex > 0) {
      const newGuesses = [...guesses];

      newGuesses[activeRowIndex] = replaceCharacter(
        newGuesses[activeRowIndex],
        activeLetterIndex - 1,
        ' '
      )

      setGuesses(newGuesses);
      setActiveLetterIndex((index) => index - 1);
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (solutionFound) return;

    if (LETTERS.includes(event.key)) {
      typeLetter(event.key);
      return;
    }

    if (event.key === 'Enter') {
      hitEnter();
      return;
    }

    if (event.key === 'Backspace') {
      hitBackspace();
    }
  }

  return (
    <div
      className='wordle'
      ref={wordleRef}
      tabIndex={0}
      onBlur={(e) => e.target.focus()}
      onKeyDown={handleKeyDown}
    >
      {notification && (
        <div className="modal">
          <p>{notification}</p>
        </div>
      )}
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
            notification !== '정답입니다!' &&
            notification !== '' &&
            activeRowIndex === index
          }
        />
      ))}
      <Keyboard
        presentLetters={presentLetters}
        correctLetters={correctLetters}
        absentLetters={absentLetters}
        typeLetter={typeLetter}
        hitEnter={hitEnter}
        hitBackspace={hitBackspace}
      />
    </div>
  )
}
