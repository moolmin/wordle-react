import './header.scss'
import { House, ChartColumnBig, Moon, CircleHelp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

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
        <button>
          <Moon />
        </button>
        <button>
          <CircleHelp />
        </button>
      </div>
    </div>
  )
}
