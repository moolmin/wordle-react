import './createGameModal.scss'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkWordExists } from '@/service/dictionaryService'
import { X } from 'lucide-react'

interface CreateGameModalProps {
  onClose: () => void
}

export default function CreateGameModal({ onClose }: CreateGameModalProps) {
  const navigate = useNavigate()
  const [inputWord, setInputWord] = useState('')
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    if (/^[A-Z]*$/.test(value) && value.length <= 5) {
      setInputWord(value)
      setError('')
    } else {
      setError('영어 5글자만 입력해주세요.')
    }
  }

  const handleCreateGame = async () => {
    if (inputWord.length !== 5) {
      setError('정확히 5글자를 입력해주세요.')
      return
    }

    const wordExists = await checkWordExists(inputWord)
    if (!wordExists) {
      setError('단어를 찾을 수 없습니다.')
      return
    }

    const encodedWord = btoa(inputWord)
    navigate(`/wordle/${encodedWord}`)
    onClose()
  }

  return (
    <div className='modalOverlay'>
      <div className='createGameModal'>
        <div className='modalContent'>
          <div className='modalHeader'>
            <h2>게임 생성하기</h2>
            <button className='closeButton' onClick={onClose}>
              <X />
            </button>
          </div>
          <p>5글자를 입력해주세요</p>

          <input
            type='text'
            value={inputWord}
            onChange={handleInputChange}
            placeholder='영어 5글자'
            maxLength={5}
          />

          {error && <p className='error'>{error}</p>}

          <div className='modalButtons'>
            <button onClick={handleCreateGame}>게임 시작하기</button>
          </div>
        </div>
      </div>
    </div>
  )
}
