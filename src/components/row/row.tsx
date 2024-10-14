import "./row.scss"

interface RowProps {
  word: string;
  solution: string;
  presentLetters?: string[]; 
  correctLetters?: string[]; 
  absentLetters?: string[]; 
  applyRotation?: boolean;
  bounceOnError?: boolean;
}

export default function Row({
  word,
  presentLetters = [], 
  correctLetters = [], 
  absentLetters = [], 
  applyRotation = false,
  bounceOnError = false,
}: RowProps) {
  return (
    <div className={`row ${bounceOnError ? "row--bounce" : ""}`}>
      {word.split("").map((letter, index) => {
        const bgClass = correctLetters.includes(letter)
          ? "correct"
          : presentLetters.includes(letter)
          ? "present"
          : absentLetters.includes(letter)
          ? "absent"
          : "";

        const letterClass = [
          "letter",
          bgClass, 
          applyRotation ? `rotate--${index + 1}00` : "",
          letter !== " " ? "letter--active" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div className={letterClass} key={index}>
            {letter}
            <div className="back">{letter}</div>
          </div>
        );
      })}
    </div>
  );
}
