import { useState, useEffect } from 'react'
import './row.scss'
import { RowProps } from '@/types/types'

export default function Row({
  word,
  solution,
  presentLetters = [],
  correctLetters = [],
  absentLetters = [],
  applyRotation = false,
  bounceOnError = false,
  status = 'pending',
}: RowProps) {
  const [finalColors, setFinalColors] = useState<string[]>([])

  useEffect(() => {
    if (status === 'complete') {
      const lockedColors = word.split('').map((letter, index) => {
        if (solution[index] === letter) return 'correct'
        if (solution.includes(letter)) return 'present'
        return 'absent'
      })
      setFinalColors(lockedColors)
    }
  }, [status, word, solution])

  return (
    <div className={`row ${bounceOnError ? 'row--bounce' : ''}`}>
      {word.split('').map((letter, index) => {
        const bgClass =
          status === 'complete'
            ? finalColors[index]
            : correctLetters.includes(letter)
              ? 'correct'
              : presentLetters.includes(letter)
                ? 'present'
                : absentLetters.includes(letter)
                  ? 'absent'
                  : ''

        const letterClass = [
          'letter',
          bgClass,
          applyRotation ? `rotate--${index + 1}00` : '',
          letter !== ' ' ? 'letter--active' : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <div className={letterClass} key={index}>
            {letter}
            <div className='back'>{letter}</div>
          </div>
        )
      })}
    </div>
  )
}
