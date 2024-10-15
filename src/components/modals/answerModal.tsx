import './answerModal.scss'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'

interface AnswerModalProps {
  decodedWord: string
  onClose: () => void
}

export default function AnswerModal({
  decodedWord,
  onClose,
}: AnswerModalProps) {
  const location = useLocation()

  const [copySuccess, setCopySuccess] = useState('')

  const handleRestart = () => {
    onClose()
    window.location.reload();
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}${location.pathname}`
    navigator.clipboard.writeText(link).then(
      () => {
        setCopySuccess('링크가 복사되었습니다!')
      }
    )
  }

  return (
    <div className='modalOverlay' >
    <div className='answerModal'>
      <div className='modalContent'>
        <div className='modalTop'>
        <h2>Game Over!</h2>
        </div>
        <p>
          정답: <strong>{decodedWord}</strong>
        </p>

        <div className='modalButtons'>
          <button onClick={handleRestart}>다시 시작하기</button>
          <button onClick={handleCopyLink}>링크 복사</button>
        </div>
        {copySuccess && <p className='copySuccess'>{copySuccess}</p>}
      </div>
    </div>
    </div>
  )
}
