export interface ModalProps {
  win?: boolean
  onClose: () => void
  onRetry?: () => void
}

export interface Statistics {
  total: number
  win: number
  distribution: number[]
}

export interface KeyboardProps {
  absentLetters: string[]
  presentLetters: string[]
  correctLetters: string[]
  typeLetter: (letter: string) => void
  hitEnter: () => void
  hitBackspace: () => void
}

export interface KeyContainerProps {
  letter: string
  typeLetter: (letter: string) => void
  isAbsent: boolean
  isPresent: boolean
  isCorrect: boolean
}

export interface LetterStatus {
  letter: string
  status: 'absent' | 'present' | 'correct'
}

export interface RowProps {
  word: string
  solution: string
  presentLetters?: string[]
  correctLetters?: string[]
  absentLetters?: string[]
  applyRotation?: boolean
  bounceOnError?: boolean
  status?: 'complete' | 'active' | 'pending'
}
