import './statisticsModal.scss'
import { X } from 'lucide-react'

interface ModalProps {
  onClose: () => void
}

export default function StatisticsModal({ onClose }: ModalProps) {
  const handleClickOutside = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const distributionData = [
    { attempt: 1, percentage: 60, count: 3 },
    { attempt: 2, percentage: 0, count: 0 },
    { attempt: 3, percentage: 0, count: 0 },
    { attempt: 4, percentage: 0, count: 0 },
    { attempt: 5, percentage: 0, count: 0 },
    { attempt: 6, percentage: 0, count: 0 },
  ]

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
              <h2>0</h2>
              <p>🕹️ 플레이 횟수</p>
            </div>
            <div className='statsItem'>
              <h2>1</h2>
              <p>🏆 정답 맞힌 횟수</p>
            </div>
            <div className='statsItem'>
              <h2>0.2</h2>
              <p>📈% 정답률</p>
            </div>
          </div>
          <div className='distributionContainer'>
            <h3>World 시도 횟수 분포도</h3>
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
        </div>
      </div>
    </div>
  )
}
