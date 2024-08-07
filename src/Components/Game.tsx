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

  const isAlphabet = (key: string): boolean => {
    return /^[a-zA-Z]$/.test(key);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>, id: string) => {
    const inputElement = document.getElementById(id) as HTMLInputElement;
    let currentEntry = enteredWord;

    if (isAlphabet(e.key) && currentEntry.length < wordLength) {
      inputElement.value = e.key.toUpperCase();
      currentEntry += e.key.toUpperCase();
      setEnteredWord(currentEntry);
      document.getElementById(`input_${Number(id.split("_")[1]) + 1}`)?.focus();
    } else if (e.key.toLowerCase() === "backspace" && currentEntry.length > 0) {
      inputElement.value = "";
      currentEntry = currentEntry.slice(0, -1);
      setEnteredWord(currentEntry);
      document.getElementById(`input_${Number(id.split("_")[1]) - 1}`)?.focus();
    } else if (e.key.toLocaleLowerCase() === "enter") {
      if (currentEntry.length === wordLength) {
        let entryArray = entries;
        let firstEmptyIndex = 0;
        for (let i = 0; i < entryArray.length; i++) {
          if (entryArray[i] === "") {
            firstEmptyIndex = i;
            break;
          }
        }
        entryArray[firstEmptyIndex] = currentEntry;
        setEntries(entryArray);

        setTriesDone(triesDone + 1);

        setEnteredWord("");

        for (let i = wordLength - 1; i >= 0; --i) {
          let currentElement = document.getElementById(
            `input_${i}`
          ) as HTMLInputElement;
          currentElement.value = "";
        }
        document.getElementById(`input_0`)?.focus();

        return;
      }
    }
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
                onKeyUp={(e) => handleKeyUp(e, `input_${i}`)}
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
