import Header from "./components/Header";
import { languages } from "./languages";
import { useState } from "react";
import { getFarewellText, getRandomWord } from "./utils";
import Confetti from "react-confetti";
export default function App() {
  //  state values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [gussedLetters, setGussedLetters] = useState([]);

  // derived values
  const wrongGuessCount = gussedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  const isGameWon = currentWord
    .split("")
    .every((letter) => gussedLetters.includes(letter));
  const isGameLost = wrongGuessCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;
  const lastGuessedLetter = gussedLetters[gussedLetters.length - 1];
  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  // static values
  const alphabets = "abcdefghijklmnopqrstuvwxyz";

  const languageElements = languages.map((language, index) => (
    <span
      key={language.name}
      className={`chip ${index < wrongGuessCount ? "lost" : ""}`}
      style={{
        backgroundColor: language.backgroundColor,
        color: language.color,
      }}
    >
      {language.name}
    </span>
  ));

  const letterElements = currentWord.split("").map((letter, index) => (
    <span
      className={
        isGameLost && !gussedLetters.includes(letter) ? "missed-letter" : null
      }
      key={index}
    >
      {gussedLetters.includes(letter) || isGameLost ? letter.toUpperCase() : ""}
    </span>
  ));

  function addGussedLetters(letter) {
    setGussedLetters((prevLetters) =>
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    );
  }

  const keyboardElements = alphabets.split("").map((letter) => {
    const isGussed = gussedLetters.includes(letter);
    const isCorrect = isGussed && currentWord.includes(letter);
    const isWrong = isGussed && !currentWord.includes(letter);
    let backgroundcolor;
    if (isGussed) {
      if (isCorrect) {
        backgroundcolor = "#10a95b";
      }
      if (isWrong) {
        backgroundcolor = "#ec5d49";
      }
    }

    return (
      <button
        disabled={isGameOver}
        aria-disabled={gussedLetters.includes(letter)}
        aria-label={`letter ${letter}`}
        style={{
          backgroundColor: backgroundcolor,
        }}
        onClick={() => addGussedLetters(letter)}
        key={letter}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <p className="farewell-message">
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      );
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done🎉!</p>
        </>
      );
    }
    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You loose! Better start learning Assembly😭 </p>
        </>
      );
    }
    return null;
  }

  function gameStatusStyles() {
    if (!isGameOver && isLastGuessIncorrect) {
      return "farewell";
    }
    if (isGameWon) {
      return "won";
    }
    if (isGameLost) {
      return "lost";
    }
    return null;
  }

  function startNewGame() {
    setCurrentWord(getRandomWord());
    setGussedLetters([]);
  }

  return (
    <main>
      {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}
      <Header />
      <section
        aria-live="polite"
        role="status"
        className={`game-status ${gameStatusStyles()}`}
      >
        {renderGameStatus()}
      </section>
      <section className="language-chips">{languageElements}</section>
      <section className="word">{letterElements}</section>
      <section className="keyboard">{keyboardElements}</section>
      {isGameOver && (
        <button className="new-game" onClick={startNewGame}>
          New Game
        </button>
      )}
    </main>
  );
}
