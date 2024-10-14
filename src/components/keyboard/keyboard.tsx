import './keyboard.scss'
import { LETTERS } from '@/constants/letters'
import KeyItem from '@components/keyItem/keyItem'
import { Delete } from 'lucide-react'

interface KeyboardProps {
  absentLetters: string[]
  presentLetters: string[]
  correctLetters: string[]
  typeLetter: (letter: string) => void
  hitEnter: () => void
  hitBackspace: () => void
}

export default function Keyboard({
  absentLetters,
  presentLetters,
  correctLetters,
  typeLetter,
  hitEnter,
  hitBackspace,
}: KeyboardProps) {
  return (
    <div className='keyboard'>
      <div className='keyRow'>
        {LETTERS.slice(0, 10).map((letter) => (
          <KeyItem
            key={letter}
            letter={letter}
            typeLetter={typeLetter}
            isAbsent={absentLetters.includes(letter)}
            isPresent={presentLetters.includes(letter)}
            isCorrect={correctLetters.includes(letter)}
          />
        ))}
      </div>

      <div className='keyRow'>
        {LETTERS.slice(10, 19).map((letter) => (
          <KeyItem
            key={letter}
            letter={letter}
            typeLetter={typeLetter}
            isAbsent={absentLetters.includes(letter)}
            isPresent={presentLetters.includes(letter)}
            isCorrect={correctLetters.includes(letter)}
          />
        ))}
      </div>

      <div className='keyRow'>
        <div className='key backspace' onClick={hitBackspace}>
          <Delete size={32} />
        </div>
        {LETTERS.slice(19, 26).map((letter) => (
          <KeyItem
            key={letter}
            letter={letter}
            typeLetter={typeLetter}
            isAbsent={absentLetters.includes(letter)}
            isPresent={presentLetters.includes(letter)}
            isCorrect={correctLetters.includes(letter)}
          />
        ))}

        <div className='key enter' onClick={hitEnter}>
          ENTER
        </div>
      </div>
    </div>
  )
}
