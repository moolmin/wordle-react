import { useState, useEffect } from 'react'
import './header.scss'
import { House, ChartColumnBig, Moon, Sun, CircleHelp } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import AnswerModal from '@components/modals/answerModal/answerModal'
import StatisticsModal from '@components/modals/statisticsModal/statisticsModal'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  const [isDarkMode, setDarkMode] = useState(false)
  const [showAnswerModal, setShowAnswerModal] = useState(false)
  const [showStatisticsModal, setShowStatisticsModal] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.body.classList.add('dark-mode')
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode)

    if (!isDarkMode) {
      document.body.classList.add('dark-mode')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark-mode')
      localStorage.setItem('theme', 'light')
    }
  }

  const getDecodedWord = () => {
    const encodedWord = location.pathname.split('/').pop()
    return encodedWord ? atob(encodedWord) : 'UNKNOWN'
  }

  const isGamePath = () => {
    return location.pathname.startsWith('/wordle')
  }

  const toggleStatisticsModal = () => {
    setShowStatisticsModal(!showStatisticsModal)
  }

  return (
    <div className='header'>
      {isGamePath() && (
        <div className='left-buttons'>
          <button
            onClick={() => {
              navigate('/')
            }}
          >
            <House />
          </button>
          <button className='answer' onClick={() => setShowAnswerModal(true)}>
            정답확인
          </button>
        </div>
      )}
      <div className='header-title'></div>
      <div className='right-buttons'>
        <button onClick={toggleStatisticsModal}>
          <ChartColumnBig />
        </button>
        <button onClick={toggleDarkMode}>
          {isDarkMode ? <Sun /> : <Moon />}
        </button>
        <button>
          <CircleHelp />
        </button>
      </div>

      {showAnswerModal && (
        <AnswerModal
          decodedWord={getDecodedWord()}
          onClose={() => setShowAnswerModal(false)}
        />
      )}

      {showStatisticsModal && (
        <StatisticsModal onClose={() => setShowStatisticsModal(false)} />
      )}
    </div>
  )
}
