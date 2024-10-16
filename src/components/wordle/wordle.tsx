import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './wordle.scss'
import Row from '@components/row/row'
import { LETTERS } from '@/constants/letters'
import { checkWordExists } from '@/service/dictionaryService'
import Keyboard from '@components/keyboard/keyboard'
import { Timer } from 'lucide-react'
import GameOverModal from '@components/modals/gameOverModal/gameOverModal'

interface ModalProps {
  win: boolean
  onClose: () => void
  onRetry: () => void
}

function useTimer(isPlaying: boolean, initialTime: number) {
  const [timer, setTimer] = useState(initialTime)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isPlaying) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying])

  return { timer }
}

function saveToLocalStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}

function loadFromLocalStorage(key: string, fallback: any = {}) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : fallback
}

export default function Wordle() {
  const { encodedWord } = useParams()
  const SOLUTION = encodedWord ? atob(encodedWord).toLowerCase() : ''

  const initialStats = loadFromLocalStorage('statistics', {
    total: 0,
    win: 0,
    distribution: [0, 0, 0, 0, 0, 0],
  })

  const initialHistory = loadFromLocalStorage('history', {
    guesses: ['     ', '     ', '     ', '     ', '     ', '     '],
    solutionFound: false,
    activeLetterIndex: 0,
    activeRowIndex: 0,
    failedGuesses: [],
    correctLetters: [],
    presentLetters: [],
    absentLetters: [],
    timer: 0,
    isPlaying: false,
  })

  const [stats, setStats] = useState(initialStats)
  const [guesses, setGuesses] = useState<string[]>(initialHistory.guesses)
  const [solutionFound, setSolutionFound] = useState(initialHistory.solutionFound)
  const [activeLetterIndex, setActiveLetterIndex] = useState(initialHistory.activeLetterIndex)
  const [notification, setNotification] = useState('')
  const [activeRowIndex, setActiveRowIndex] = useState(initialHistory.activeRowIndex)
  const [failedGuesses, setFailedGuesses] = useState<string[]>(initialHistory.failedGuesses)
  const [correctLetters, setCorrectLetters] = useState<string[]>(initialHistory.correctLetters)
  const [presentLetters, setPresentLetters] = useState<string[]>(initialHistory.presentLetters)
  const [absentLetters, setAbsentLetters] = useState<string[]>(initialHistory.absentLetters)
  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [win, setWin] = useState(false)
  const [isPlaying, setIsPlaying] = useState(initialHistory.isPlaying)

  // 타이머 훅 사용
  const { timer } = useTimer(isPlaying, initialHistory.timer)

  const wordleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (wordleRef.current) wordleRef.current.focus()
  }, [])

  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => setNotification(''), 2000)
      return () => clearTimeout(timeout)
    }
  }, [notification])

  const saveGameState = () => {
    const gameState = {
      guesses,
      solutionFound,
      activeLetterIndex,
      activeRowIndex,
      failedGuesses,
      correctLetters,
      presentLetters,
      absentLetters,
      timer,
      isPlaying,
    }
    saveToLocalStorage('history', gameState)
  }

  const updateStats = (attemptCount: number, isCorrect: boolean) => {
    const newStats = {
      total: stats.total + 1,
      win: isCorrect ? stats.win + 1 : stats.win,
      distribution: stats.distribution.map((count, index) =>
        index === attemptCount ? count + 1 : count
      ),
    }
    setStats(newStats)
    saveToLocalStorage('statistics', newStats)
  }

  const endGame = (didWin: boolean) => {
    setWin(didWin)
    setShowGameOverModal(true)
    setIsPlaying(false)
    saveToLocalStorage('history', { ...initialHistory, isPlaying: false })
  }

  const handleWinOrLoss = () => {
    if (solutionFound || activeRowIndex === 6) {
      updateStats(activeRowIndex, solutionFound)
      endGame(solutionFound)
    }
  }

  useEffect(() => handleWinOrLoss(), [solutionFound, activeRowIndex])

  const startGame = () => {
    setIsPlaying(true)
    saveToLocalStorage('history', { ...initialHistory, isPlaying: true })
  }

  useEffect(() => {
    if (!isPlaying) startGame()
  }, [])

  const typeLetter = (letter: string) => {
    if (activeLetterIndex < 5) {
      const newGuesses = [...guesses]
      newGuesses[activeRowIndex] = replaceCharacter(newGuesses[activeRowIndex], activeLetterIndex, letter)
      setGuesses(newGuesses)
      setActiveLetterIndex((index) => index + 1)
      saveGameState()
    }
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
        setSolutionFound(true)
        setNotification('정답입니다!')
        setCorrectLetters([...SOLUTION])
      } else {
        processGuess(currentGuess)
      }
    } else {
      setNotification('5글자가 아닙니다')
    }
  }

  const processGuess = (currentGuess: string) => {
    const newCorrectLetters = currentGuess
      .split('')
      .filter((letter, index) => SOLUTION[index] === letter)

    setCorrectLetters([...new Set([...correctLetters, ...newCorrectLetters])])
    setPresentLetters([
      ...new Set([...presentLetters, ...currentGuess.split('').filter((letter) => SOLUTION.includes(letter))]),
    ])
    setAbsentLetters([
      ...new Set([...absentLetters, ...currentGuess.split('').filter((letter) => !SOLUTION.includes(letter))]),
    ])
    setFailedGuesses([...failedGuesses, currentGuess])
    setActiveRowIndex((index) => index + 1)
    setActiveLetterIndex(0)
    saveGameState()
  }

  const hitBackspace = () => {
    if (activeLetterIndex > 0) {
      const newGuesses = [...guesses]
      newGuesses[activeRowIndex] = replaceCharacter(newGuesses[activeRowIndex], activeLetterIndex - 1, ' ')
      setGuesses(newGuesses)
      setActiveLetterIndex((index) => index - 1)
      saveGameState()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (solutionFound) return
    if (LETTERS.includes(event.key)) typeLetter(event.key)
    else if (event.key === 'Enter') hitEnter()
    else if (event.key === 'Backspace') hitBackspace()
  }

  return (
    <div className='wordle' ref={wordleRef} tabIndex={0} onBlur={(e) => e.target.focus()} onKeyDown={handleKeyDown}>
      <div className='timer'>
        <Timer />
        <p>{isPlaying ? formatTime(timer) : '--:--'}</p>
      </div>

      {notification && <div className='modal'><p>{notification}</p></div>}

      {guesses.map((guess, index) => (
        <Row
          key={index}
          word={guess}
          presentLetters={presentLetters}
          correctLetters={correctLetters}
          absentLetters={absentLetters}
          applyRotation={activeRowIndex > index || (solutionFound && activeRowIndex === index)}
          solution={SOLUTION}
          status={index < activeRowIndex ? 'complete' : index === activeRowIndex ? 'active' : 'pending'}
        />
      ))}
      <Keyboard presentLetters={presentLetters} correctLetters={correctLetters} absentLetters={absentLetters} typeLetter={typeLetter} hitEnter={hitEnter} hitBackspace={hitBackspace} />
      {showGameOverModal && <GameOverModal win={win} onClose={() => setShowGameOverModal(false)} onRetry={() => window.location.reload()} />}
    </div>
  )
}

function replaceCharacter(str: string, index: number, replacement: string) {
  return str.slice(0, index) + replacement + str.slice(index + 1)
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}
