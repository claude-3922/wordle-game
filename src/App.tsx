import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";

interface AppProps {
  wordLength: number;
  numTries: number;
}

function App({ wordLength, numTries }: AppProps) {
  const [word, setWord] = useState("rando");
  const [enteredWord, setEnteredWord] = useState("");
  let initialTryArray = [];
  for (let i = 0; i < numTries; i++) {
    initialTryArray.push("");
  }
  const [entries, setEntries] = useState(initialTryArray);
  const [triesDone, setTriesDone] = useState(0);

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.toUpperCase();
    if (triesDone <= numTries && e.target.value.length === wordLength) {
      setEnteredWord(e.target.value);

      let currentEntries = entries;
      currentEntries[triesDone] = enteredWord;
      setEntries(currentEntries);

      console.log(currentEntries);

      setTriesDone(triesDone + 1);

      e.target.value = "";
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <input
          maxLength={wordLength}
          onChange={handleChange}
          className="border-2 tracking-widest"
        />
        <p>
          {enteredWord
            .split("")
            .map((c, i) =>
              word.split("").includes(c) ? (
                word.split("")[i] === c ? (
                  <span className="text-green-600">{c || "_"}</span>
                ) : (
                  <span className="text-yellow-600">{c || "_"}</span>
                )
              ) : (
                <span className="text-gray-600">{c || "_"}</span>
              )
            )}
        </p>
      </div>
    </>
  );
}

/*
<span className="container">
        {[...Array(wordLength)].map((_e, i) => (
          <input
            className="border-2 w-5"
            id={`${i}`}
            key={i}
            maxLength={1}
            onChange={handleChange}
          />
        ))}
      </span>
*/

export default App;
