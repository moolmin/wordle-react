import './landing.scss';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const letters = ['W', 'O', 'R', 'D', 'L', 'E'];
  const navigate = useNavigate();

  const handleStart = () => {
    const word = 'world';
    const encodedWord = btoa(word); 
    navigate(`/game/${encodedWord}`); 
  };

  return (
    <div className="landing">
        <div className='letterContainer'>
      {letters.map((letter, index) => (
        <div className={`flipWord rotate--${index + 1}00`} key={index}>
          <div className="front">{letter}</div>
          <div className="back">{letter}</div> 
        </div>
      ))}
      </div>
      <div className='btnContainer'>
      <button onClick={handleStart}>시작하기</button>
        <button>워들 생성하기</button>
      </div>
    </div>
  );
}
