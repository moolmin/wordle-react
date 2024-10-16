import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './wordle.scss'
import Row from '@components/row/row'
import { LETTERS } from '@/constants/letters'
import { checkWordExists } from '@/service/dictionaryService'
import Keyboard from '@components/keyboard/keyboard'
import { Timer } from 'lucide-react'
import GameOverModal from '@components/modals/gameOverModal/gameOverModal'

export default function Wordle() {
  const { encodedWord } = useParams()
  const SOLUTION = encodedWord ? atob(encodedWord).toLowerCase() : ''

  const initialStats = JSON.parse(localStorage.getItem('statistics') || '{}')
  const initialHistory = JSON.parse(localStorage.getItem('history') || '{}')

  const [stats, setStats] = useState({
    total: initialStats.total || 0,
    win: initialStats.win || 0,
    distribution: initialStats.distribution || [0, 0, 0, 0, 0, 0],
  })

  const [guesses, setGuesses] = useState<string[]>(
    initialHistory.guesses || [
      '     ',
      '     ',
      '     ',
      '     ',
      '     ',
      '     ',
    ]
  )
  const [solutionFound, setSolutionFound] = useState(
    initialHistory.solutionFound || false
  )
  const [activeLetterIndex, setActiveLetterIndex] = useState(
    initialHistory.activeLetterIndex || 0
  )
  const [notification, setNotification] = useState('')
  const [activeRowIndex, setActiveRowIndex] = useState(
    initialHistory.activeRowIndex || 0
  )
  const [failedGuesses, setFailedGuesses] = useState<string[]>(
    initialHistory.failedGuesses || []
  )
  const [correctLetters, setCorrectLetters] = useState<string[]>(
    initialHistory.correctLetters || []
  )
  const [presentLetters, setPresentLetters] = useState<string[]>(
    initialHistory.presentLetters || []
  )
  const [absentLetters, setAbsentLetters] = useState<string[]>(
    initialHistory.absentLetters || []
  )
  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [win, setWin] = useState(false)

  const [timer, setTimer] = useState(initialHistory.timer || 0)
  const [isPlaying, setIsPlaying] = useState(
    initialHistory.isPlaying !== undefined ? initialHistory.isPlaying : false
  )

  const wordleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (wordleRef.current) {
      wordleRef.current.focus()
    }

    let interval: NodeJS.Timeout | null = null

    if (isPlaying) {
      interval = setInterval(() => {
        setTimer((prev: number) => {
          const newTime = prev + 1
          const history = JSON.parse(localStorage.getItem('history') || '{}')
          localStorage.setItem(
            'history',
            JSON.stringify({ ...history, timer: newTime })
          )
          return newTime
        })
      }, 1000)
    } else {
      if (interval) clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying])

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('')
      }, 2000)

      return () => clearTimeout(timer)
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
    localStorage.setItem('history', JSON.stringify(gameState))
  }

  const updateStats = (attemptCount: number, isCorrect: boolean) => {
    const newStats = {
      total: stats.total + 1,
      win: isCorrect ? stats.win + 1 : stats.win,
      distribution: stats.distribution.map((count: number, index: number) =>
        index === attemptCount ? count + 1 : count
      ),
    }

    setStats(newStats)
    localStorage.setItem('statistics', JSON.stringify(newStats))
  }

  const endGame = (didWin: boolean) => {
    setWin(didWin)
    setShowGameOverModal(true)
    setIsPlaying(false)
    const history = JSON.parse(localStorage.getItem('history') || '{}')
    localStorage.setItem(
      'history',
      JSON.stringify({ ...history, isPlaying: false })
    )
  }

  useEffect(() => {
    if (solutionFound || activeRowIndex === 6) {
      updateStats(activeRowIndex, solutionFound)
      endGame(solutionFound)
    }
  }, [solutionFound, activeRowIndex])

  useEffect(() => {
    if (!isPlaying) {
      const startGame = () => {
        setIsPlaying(true)
        const history = JSON.parse(localStorage.getItem('history') || '{}')
        localStorage.setItem(
          'history',
          JSON.stringify({ ...history, isPlaying: true })
        )
      }

      startGame()
    }
  }, [])

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
      setActiveLetterIndex((index: number) => index + 1)
      saveGameState()
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

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
        setSolutionFound(true)
        setNotification('정답입니다!')
        setCorrectLetters([...SOLUTION])
      } else {
        let newCorrectLetters: string[] = []

        currentGuess.split('').forEach((letter, index) => {
          if (SOLUTION[index] === letter) newCorrectLetters.push(letter)
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

        setFailedGuesses([...failedGuesses, currentGuess])
        setActiveRowIndex((index: number) => index + 1)
        setActiveLetterIndex(0)
        saveGameState()
      }
    } else {
      setNotification('5글자가 아닙니다')
    }
  }

  const hitBackspace = () => {
    setNotification('')
    if (activeLetterIndex > 0) {
      const newGuesses = [...guesses]
      newGuesses[activeRowIndex] = replaceCharacter(
        newGuesses[activeRowIndex],
        activeLetterIndex - 1,
        ' '
      )
      setGuesses(newGuesses)
      setActiveLetterIndex((index: number) => index - 1)
      saveGameState()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (solutionFound) return

    if (LETTERS.includes(event.key)) {
      typeLetter(event.key)
      return
    }

    if (event.key === 'Enter') {
      hitEnter()
      return
    }

    if (event.key === 'Backspace') {
      hitBackspace()
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
      <div className='timer'>
        <Timer />
        <p>{formatTime(timer)}</p>
      </div>

      {notification && (
        <div className='modal'>
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
      {showGameOverModal && (
        <GameOverModal
          win={win}
          onClose={() => setShowGameOverModal(false)}
          onRetry={() => window.location.reload()}
        />
      )}
    </div>
  )
}
