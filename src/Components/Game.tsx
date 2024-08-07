import axios from "axios";
import {
  Fragment,
  useEffect,
  useState,
  KeyboardEvent,
  ChangeEvent,
} from "react";

interface GameProps {
  wordLength: number;
  numTries: number;
}

function Game({ wordLength, numTries }: GameProps) {
  const [word, setWord] = useState("rando");
  const [enteredWord, setEnteredWord] = useState("");
  let initialTryArray = [];
  for (let i = 0; i < numTries; i++) {
    initialTryArray.push("");
  }
  const [entries, setEntries] = useState(initialTryArray);
  const [triesDone, setTriesDone] = useState(0);
  const [showCorrectWord, setShowCorrectWord] = useState(false);

  useEffect(() => {
    axios
      .get(
        `https://random-word-api.vercel.app/api?words=1&length=${wordLength}`
      )
      .then((res) => {
        setWord(res.data[0].toUpperCase());
        console.log(res.data[0].toUpperCase());
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (triesDone === numTries || enteredWord === word) {
      setShowCorrectWord(true);
    }
  }, [triesDone]);

  const isAlphaNumeric = (str: string) => {
    return /^[a-zA-Z0-9]+$/.test(str);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, id: string) => {
    setTimeout(() => {}, 1000);

    if (isAlphaNumeric(e.key)) {
      document.getElementById(`input_${Number(id.split("_")[1]) + 1}`)?.focus();
    } else if (e.key.toLowerCase() === "backspace") {
      document.getElementById(`input_${Number(id.split("_")[1]) - 1}`)?.focus();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.toUpperCase();
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center" id="game">
        <div>
          {Array.from({ length: wordLength }, (e, i) => (
            <span>
              <input
                id={`input_${i}`}
                type="text"
                maxLength={1}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, `input_${i}`)}
                className={`border-2 w-14`}
              />
            </span>
          ))}
        </div>

        <p className="tries">
          {entries.map((row, rowIndex) => (
            <div>
              <Fragment key={rowIndex}>
                {row.split("").map((c, charIndex) => (
                  <span
                    key={charIndex}
                    className={
                      word.includes(c)
                        ? word.charAt(charIndex) === c
                          ? "text-green-600"
                          : "text-yellow-600"
                        : "text-gray-600"
                    }
                  >
                    {c}
                  </span>
                ))}
              </Fragment>
            </div>
          ))}
        </p>
        {showCorrectWord && <p>Correct word is: {word}</p>}
      </div>
    </>
  );
}

export default Game;
