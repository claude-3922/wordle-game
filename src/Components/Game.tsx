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
  const [gameEnded, setGameEnded] = useState(false);
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
    if (gameEnded) {
      for (let i = 0; i < wordLength; i++) {
        let currentInput = document.getElementById(
          `input_${i}`
        ) as HTMLInputElement;
        currentInput.disabled = true;
      }
    }
  }, [gameEnded]);

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
    } else if (e.key.toLowerCase() === "enter") {
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

        let tries = triesDone + 1;
        setTriesDone(tries);

        if (tries === numTries || entries.includes(word)) {
          setGameEnded(true);
        }

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.toUpperCase();
  };

  return (
    <>
      <div className="flex flex-col justify-start items-center" id="game">
        <div className="flex flex-row justify-start items-center">
          {Array.from({ length: wordLength }, (e, i) => (
            <span>
              <input
                id={`input_${i}`}
                type="text"
                maxLength={1}
                onKeyUp={(e) => handleKeyUp(e, `input_${i}`)}
                onChange={handleChange}
                className={`min-w-[1.75ch] max-w-[2ch] min-h-[1.75ch] max-h-[2ch] text-white text-[30px] p-[4px] m-[4px] sm:font-semibold sm:indent-2.5 sm:min-w-[2.5ch] sm:max-w-[3ch] sm:min-h-[2.5ch] sm:max-h-[3ch] sm:text-[32px] sm:p-[6px] sm:m-[6px] md:font-semibold md:indent-3 md:min-w-[3ch] md:max-w-[3.5ch] md:min-h-[3ch] md:max-h-[3.5ch] md:text-[34px] md:p-[8px] md:m-[8px] lg:font-black lg:indent-7 lg:min-w-[4ch] lg:max-w-[5ch] lg:min-h-[4ch] lg:max-h-[5ch] lg:text-[36px] lg:p-[10px] lg:m-[10px] bg-gray-900 text-white`}
              />
            </span>
          ))}
        </div>

        <div className="tries">
          {entries.map((row, rowIndex) => (
            <div className="flex flex-row items-center justify-center">
              <Fragment key={rowIndex}>
                {row.split("").map((c, charIndex) => (
                  <span key={charIndex}>
                    <input
                      key={c}
                      disabled
                      placeholder={c}
                      size={1}
                      className={
                        word.includes(c)
                          ? word.charAt(charIndex) === c
                            ? "min-w-[1.75ch] max-w-[2ch] min-h-[1.75ch] max-h-[2ch] text-white text-[30px] p-[4px] m-[4px] sm:font-semibold sm:indent-2.5 sm:min-w-[2.5ch] sm:max-w-[3ch] sm:min-h-[2.5ch] sm:max-h-[3ch] sm:text-[32px] sm:p-[6px] sm:m-[6px] md:font-semibold md:indent-3 md:min-w-[3ch] md:max-w-[3.5ch] md:min-h-[3ch] md:max-h-[3.5ch] md:text-[34px] md:p-[8px] md:m-[8px] lg:font-black lg:indent-7 lg:min-w-[4ch] lg:max-w-[5ch] lg:min-h-[4ch] lg:max-h-[5ch] lg:text-[36px] lg:p-[10px] lg:m-[10px] bg-green-600 placeholder:text-white"
                            : "min-w-[1.75ch] max-w-[2ch] min-h-[1.75ch] max-h-[2ch] text-white text-[30px] p-[4px] m-[4px] sm:font-semibold sm:indent-2.5 sm:min-w-[2.5ch] sm:max-w-[3ch] sm:min-h-[2.5ch] sm:max-h-[3ch] sm:text-[32px] sm:p-[6px] sm:m-[6px] md:font-semibold md:indent-3 md:min-w-[3ch] md:max-w-[3.5ch] md:min-h-[3ch] md:max-h-[3.5ch] md:text-[34px] md:p-[8px] md:m-[8px] lg:font-black lg:indent-7 lg:min-w-[4ch] lg:max-w-[5ch] lg:min-h-[4ch] lg:max-h-[5ch] lg:text-[36px] lg:p-[10px] lg:m-[10px] bg-yellow-600 placeholder:text-white"
                          : "min-w-[1.75ch] max-w-[2ch] min-h-[1.75ch] max-h-[2ch] text-white text-[30px] p-[4px] m-[4px] sm:font-semibold sm:indent-2.5 sm:min-w-[2.5ch] sm:max-w-[3ch] sm:min-h-[2.5ch] sm:max-h-[3ch] sm:text-[32px] sm:p-[6px] sm:m-[6px] md:font-semibold md:indent-3 md:min-w-[3ch] md:max-w-[3.5ch] md:min-h-[3ch] md:max-h-[3.5ch] md:text-[34px] md:p-[8px] md:m-[8px] lg:font-black lg:indent-7 lg:min-w-[4ch] lg:max-w-[5ch] lg:min-h-[4ch] lg:max-h-[5ch] lg:text-[36px] lg:p-[10px] lg:m-[10px] bg-gray-600 placeholder:text-white"
                      }
                    />
                  </span>
                ))}
              </Fragment>
            </div>
          ))}
        </div>
        {gameEnded && <p>Correct word is: {word}</p>}
      </div>
    </>
  );
}

export default Game;
