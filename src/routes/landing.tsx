import './landing.scss'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateGameModal from '@/components/modals/createGameModal/createGameModal'
import { WORDS } from '@/constants/words'

export default function Landing() {
  const navigate = useNavigate()
  const letters = ['W', 'O', 'R', 'D', 'L', 'E']
  const [showCreateGameModal, setShowCreateGameModal] = useState(false)

  useEffect(() => {
    localStorage.removeItem('history')
  }, [])

  const handleStart = () => {
    const randomIndex = Math.floor(Math.random() * WORDS.length)
    const word = WORDS[randomIndex]
    const encodedWord = btoa(word)

    const storedStats = localStorage.getItem('statistics')
    let stats = {
      total: 0,
      win: 0,
      distribution: [0, 0, 0, 0, 0, 0],
    }

    if (storedStats) {
      stats = JSON.parse(storedStats)
    }

    stats.total += 1
    localStorage.setItem('statistics', JSON.stringify(stats))
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
