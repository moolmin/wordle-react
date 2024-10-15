import './statisticsModal.scss'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  onClose: () => void
}

interface Statistics {
  total: number
  win: number
  distribution: number[]
}

export default function StatisticsModal({ onClose }: ModalProps) {
  const [statistics, setStatistics] = useState<Statistics>({
    total: 0,
    win: 0,
    distribution: [0, 0, 0, 0, 0, 0],
  })

  useEffect(() => {
    const storedStats = localStorage.getItem('statistics')
    if (storedStats) {
      const parsedStats = JSON.parse(storedStats)
      setStatistics(parsedStats)
    }
  }, [])

  const handleClickOutside = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const winRate =
    statistics.total > 0
      ? Math.floor((statistics.win / statistics.total) * 100)
      : 0

  const distributionData = statistics.distribution.map((count, index) => {
    const percentage =
      statistics.total > 0 ? (count / statistics.total) * 100 : 0
    return {
      attempt: index + 1,
      percentage: percentage.toFixed(1),
      count: count,
    }
  })

  const resetStatistics = () => {
    const confirmReset = window.confirm('정말 삭제하시겠습니까?')
    if (confirmReset) {
      // 로컬 스토리지에서 statistics 삭제
      localStorage.removeItem('statistics')

      // 상태 초기화
      setStatistics({
        total: 0,
        win: 0,
        distribution: [0, 0, 0, 0, 0, 0],
      })
    }
  }

  return (
    <div className='modalOverlayTransparent' onClick={handleClickOutside}>
      <div className='statisticsModal modalContainer'>
        <div className='modalHeaderStat modalHeader'>
          <h2>통계</h2>
          <button className='closeButton' onClick={onClose}>
            <X />
          </button>
        </div>
        <div className='modalContent'>
          <div className='statsContainer'>
            <div className='statsItem'>
              <h2>{statistics.total}</h2>
              <p>🕹️ 플레이 횟수</p>
            </div>
            <div className='statsItem'>
              <h2>{statistics.win}</h2>
              <p>🏆 정답 맞힌 횟수</p>
            </div>
            <div className='statsItem'>
              <h2>{winRate}%</h2>
              <p>📈% 정답률</p>
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
          <div className='resetBtnContainer'>
            <button onClick={resetStatistics}><p>통계 초기화</p></button>
          </div>
        </div>
      </div>
    </div>
  )
}
