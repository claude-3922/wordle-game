import axios from "axios";
import {
  Fragment,
  useEffect,
  useState,
  KeyboardEvent,
  ChangeEvent,
  MouseEvent,
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

  const handleClick = (e: MouseEvent<HTMLImageElement>) => {
    window.location.reload();
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
                className={`max-w-[2.5ch] max-h-[2.5ch] indent-3 text-white text-[30px] m-[2px] lg:font-black lg:indent-4 lg:max-w-[3.75ch] lg:max-h-[3.75ch] lg:p-[12px] lg:text-[36px] lg:m-[4px] bg-gray-900 text-white`}
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
                            ? "max-w-[2.5ch] max-h-[2.5ch] indent-3 text-white text-[30px] m-[2px] lg:font-black lg:indent-4 lg:max-w-[3.75ch] lg:max-h-[3.75ch] lg:p-[12px] lg:text-[36px] lg:m-[4px] bg-green-600 placeholder:text-white"
                            : "max-w-[2.5ch] max-h-[2.5ch] indent-3 text-white text-[30px] m-[2px] lg:font-black lg:indent-4 lg:max-w-[3.75ch] lg:max-h-[3.75ch] lg:p-[12px] lg:text-[36px] lg:m-[4px] bg-yellow-600 placeholder:text-white"
                          : "max-w-[2.5ch] max-h-[2.5ch] indent-3 text-white text-[30px] m-[2px] lg:font-black lg:indent-4 lg:max-w-[3.75ch] lg:max-h-[3.75ch] lg:p-[12px] lg:text-[36px] lg:m-[4px] bg-gray-600 placeholder:text-white"
                      }
                    />
                  </span>
                ))}
              </Fragment>
            </div>
          ))}
        </div>
        {gameEnded && (
          <p className="text-[#111827] text-[30px]">Correct word is: {word}</p>
        )}
        {gameEnded && (
          <img
            className="m-[6px] p-[6px] hover:scale-110 transition-all ease-in-out hover:cursor-pointer"
            src="/icons/refresh.svg"
            width={100}
            height={100}
            onClick={handleClick}
          />
        )}
      </div>
    </>
  );
}

export default Game;
