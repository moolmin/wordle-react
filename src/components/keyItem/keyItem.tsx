import { KeyContainerProps } from '@/types/types'

export default function KeyItem({
  isAbsent,
  isPresent,
  isCorrect,
  letter,
  typeLetter,
}: KeyContainerProps) {
  return (
    <div
      className={`key ${isAbsent ? 'key--absent' : ''} ${
        isPresent ? 'key--present' : ''
      } ${isCorrect ? 'key--correct' : ''}`}
      onClick={() => typeLetter(letter)}
    >
      {letter}
    </div>
  )
}
