import './gameOverModal.scss'
import { useEffect, useState } from 'react'

interface ModalProps {
  win: boolean
  decodedWord: string
  onRetry: () => void
}

interface Statistics {
  total: number
  win: number
  distribution: number[]
}

export default function GameOverModal({ win, onRetry }: ModalProps) {
  const [statistics, setStatistics] = useState<Statistics>({
    total: 0,
    win: 0,
    distribution: [0, 0, 0, 0, 0, 0],
  })
  const [timer, setTimer] = useState(0)
  const [linkCopied, setLinkCopied] = useState(false)

  useEffect(() => {
    const storedStats = localStorage.getItem('statistics')
    if (storedStats) {
      const parsedStats = JSON.parse(storedStats)
      setStatistics(parsedStats)
    }
    const history = localStorage.getItem('history')
    if (history) {
      const parsedHistory = JSON.parse(history)
      setTimer(parsedHistory.timer || 0)
    }
  }, [])

  const winRate =
    statistics.total > 0
      ? Math.floor((statistics.win / statistics.total) * 100)
      : 0

      const distributionSum = statistics.distribution.reduce(
        (sum, value) => sum + value,
        0
      )
      
      const distributionData = statistics.distribution.map((count, index) => {
        const percentage =
          distributionSum > 0 ? (count / distributionSum) * 100 : 0
        return {
          attempt: index + 1,
          percentage: percentage.toFixed(1),
          count: count,
        }
      })

  const handleShare = () => {
    const currentUrl = window.location.href
    navigator.clipboard.writeText(currentUrl).then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    })
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleRetry = () => {
    localStorage.removeItem('history')
    onRetry()
  }

  const getDecodedWord = () => {
    const encodedWord = location.pathname.split('/').pop()
    return encodedWord ? atob(encodedWord) : 'UNKNOWN'
  }

  const decodedWord = getDecodedWord()

  return (
    <div className='modalOverlayTransparent'>
      <div className='gameOverModal '>
        <div className='modalHeaderGameOver modalHeader'></div>
        <div className='modalContent'>
          <h1>
            {win
              ? 'Wordle을 맞췄습니다. 대단해요!'
              : 'Game Over. 다시 시도해주세요!'}
          </h1>
          <p className='answer'>
            정답: <strong>{decodedWord}</strong>
          </p>

          <div className='statsContainer'>
            <div className='statsItem'>
              <h2>{formatTime(timer)}</h2>
              <p>⏱️ 플레이 시간</p>
            </div>
            <div className='statsItem'>
              <h2>{statistics.win}</h2>
              <p>🏆 승리 횟수</p>
            </div>
            <div className='statsItem'>
              <h2>{winRate}%</h2>
              <p>📈 승률</p>
            </div>
          </div>

          <div className='distributionContainer'>
            <h3>Wordle 시도 횟수 분포도</h3>
            {distributionData.map((data) => (
              <div key={data.attempt} className='distributionRow'>
                <span className='attempt'>#{data.attempt}</span>
                <div className='progressBar'>
                  <div
                    className='progress'
                    style={{ width: `${data.percentage}%` }}
                  ></div>
                </div>
                <span className='percentage'>{data.percentage}%</span>
                <span className='count'>{data.count}</span>
              </div>
            ))}
          </div>

          <div className='buttonContainer'>
            <button onClick={handleRetry}>🔄 다시하기</button>
            <button onClick={handleShare}>📤 공유하기</button>
          </div>
          <a href='/'>메인으로</a>
          {linkCopied && (
            <p className='linkCopiedMessage'>링크가 복사되었습니다.</p>
          )}
        </div>
      </div>
    </div>
  )
}
