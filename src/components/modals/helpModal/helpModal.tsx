import './helpModal.scss'
import { X } from 'lucide-react'
import { ModalProps, LetterStatus } from '@/types/types'

const LetterBlock = ({ letter, status }: LetterStatus) => {
  return <div className={status}>{letter}</div>
}

const exampleWords1: LetterStatus[] = [
  { letter: 'T', status: 'absent' },
  { letter: 'A', status: 'present' },
  { letter: 'B', status: 'absent' },
  { letter: 'L', status: 'present' },
  { letter: 'E', status: 'correct' },
]

const exampleWords2: LetterStatus[] = [
  { letter: 'F', status: 'correct' },
  { letter: 'L', status: 'correct' },
  { letter: 'A', status: 'correct' },
  { letter: 'S', status: 'absent' },
  { letter: 'H', status: 'absent' },
]

const exampleWords3: LetterStatus[] = [
  { letter: 'F', status: 'correct' },
  { letter: 'L', status: 'correct' },
  { letter: 'A', status: 'correct' },
  { letter: 'M', status: 'correct' },
  { letter: 'E', status: 'correct' },
]

export default function HelpModal({ onClose }: ModalProps) {
  const handleClickOutside = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className='modalOverlayTransparent' onClick={handleClickOutside}>
      <div className='helpModal'>
        <div className='modalHeader'>
          <h2>도움말</h2>
          <button className='closeButton' onClick={onClose}>
            <X />
          </button>
        </div>
        <div className='modalContent'>
          <p>
            6번의 시도로 숨겨진 단어를 맞춰야 하며, <br />
            글자의 색상은 단어와 얼마나 가까운지에 따라 변합니다. <br />
            <br />
            게임을 시작하려면, 임의의 단어를 입력하세요. 예를 들어:
          </p>
          <div className='example'>
            {exampleWords1.map((word, index) => (
              <LetterBlock key={index} {...word} />
            ))}
          </div>
          <div className='instruction'>
            <div className='row'>
              <span className='absent'>T</span>
              <p>,</p>
              <span className='absent'>B</span>
              <p>: 타겟 단어에 없어요.</p>
            </div>
            <div className='row'>
              <span className='present'>A</span>
              <p>,</p>
              <span className='present'>L</span>
              <p>: 타겟 단어에 있지만 위치가 달라요.</p>
            </div>
            <div className='row'>
              <span className='correct'>L</span>
              <p>: 타겟 단어에 있으면서 위치도 같아요.</p>
            </div>
          </div>
          <div className='lastInstruction'>
            <p>타켓 단어를 찾기위한 또 다른 시도입니다.</p>
            <div className='example'>
              {exampleWords2.map((word, index) => (
                <LetterBlock key={index} {...word} />
              ))}
            </div>
            <p>거의 비슷해요.</p>
            <div className='example'>
              {exampleWords3.map((word, index) => (
                <LetterBlock key={index} {...word} />
              ))}
            </div>
            <p className='bold'>정답입니다! 🏆</p>
          </div>
        </div>
      </div>
    </div>
  )
}
