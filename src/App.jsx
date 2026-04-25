import { useEffect, useState } from "react";
import cards from "./data/cards";

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  const [deck, setDeck] = useState(shuffle(cards));
  const [index, setIndex] = useState(0);
  const [timeSetting, setTimeSetting] = useState(30);
  const [timeLeft, setTimeLeft] = useState(null);
  const [started, setStarted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  useEffect(() => {
    if (!started || timeLeft === null) return;
    if (timeLeft === 0) {
      setTimeUp(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, started]);

  const startGame = () => {
    setDeck(shuffle(cards));
    setIndex(0);
    setTimeLeft(timeSetting);
    setTimeUp(false);
    setStarted(true);
  };

  const nextCard = () => {
    setIndex(i => (i + 1) % deck.length);
    setTimeLeft(timeSetting);
    setTimeUp(false);
  };

  if (!started) {
    return (
      <div className="app">
        <h1>Bible 30 Seconds</h1>
        <div className="card">
          <h2>Select Time</h2>
          <select value={timeSetting} onChange={e => setTimeSetting(+e.target.value)}>
            <option value={30}>30 seconds</option>
            <option value={45}>45 seconds</option>
            <option value={60}>60 seconds</option>
          </select>
        </div>
        <button onClick={startGame}>Start Game</button>
      </div>
    );
  }

  const card = deck[index];

  return (
    <div className={`app ${timeUp ? "time-up shake" : ""}`}>
      <h1>{timeLeft}s</h1>
      <div className="card">
        <h2>{card.title}</h2>
        <h3>Taboo Words</h3>
        <ul>
          {card.taboo.map((w, i) => <li key={i}>{w}</li>)}
        </ul>
      </div>
      <button onClick={nextCard}>Next</button>
      <button className="skip" onClick={nextCard}>Skip</button>
    </div>
  );
}