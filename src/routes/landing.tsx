import './landing.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateGameModal from '@/components/modals/createGameModal';

export default function Landing() {
  const navigate = useNavigate()
  const letters = ['W', 'O', 'R', 'D', 'L', 'E']
  const [showCreateGameModal, setShowCreateGameModal] = useState(false)

  const handleStart = () => {
    const word = 'world'
    const encodedWord = btoa(word)
    navigate(`/wordle/${encodedWord}`)
  }

  const handleCreate = () => {
    setShowCreateGameModal(true)
  }

  return (
    <div className='landing'>
      <div className='letterContainer'>
        {letters.map((letter, index) => (
          <div className={`flipWord rotate--${index + 1}00`} key={index}>
            <div className='front'>{letter}</div>
            <div className='back'>{letter}</div>
          </div>
        ))}
      </div>
      <div className='btnContainer'>
        <button onClick={handleStart}>시작하기</button>
        <button onClick={handleCreate}>워들 생성하기</button>
      </div>

      {showCreateGameModal && (
        <CreateGameModal onClose={() => setShowCreateGameModal(false)} />
      )}
    </div>
  )
}
