import { useState, useEffect } from 'react'
import './header.scss'
import { House, ChartColumnBig, Moon, Sun, CircleHelp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()
  const [isDarkMode, setDarkMode] = useState(false)

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

  return (
    <div className='header'>
      <div className='left-buttons'>
        <button
          onClick={() => {
            navigate('/')
          }}
        >
          <House />
        </button>
        <button className='answer'>정답확인</button>
      </div>
      <div className='header-title'></div>
      <div className='right-buttons'>
        <button>
          <ChartColumnBig />
        </button>
        <button onClick={toggleDarkMode}>
          {isDarkMode ? <Sun /> : <Moon />}
        </button>
        <button>
          <CircleHelp />
        </button>
      </div>
    </div>
  )
}
