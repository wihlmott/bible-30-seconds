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

    const [started, setStarted] = useState(false);
    const [ended, setEnded] = useState(false);

    const [timeLeft, setTimeLeft] = useState(30);
    const [timeUp, setTimeUp] = useState(false);

    const [teamCount, setTeamCount] = useState(null);
    const [teams, setTeams] = useState([]);
    const [currentTeam, setCurrentTeam] = useState(0);

    const [settings, setSettings] = useState({
        skipPenalty: -1,
        roundType: "time", // "time" | "cards"
        maxRounds: 10,
    });

    const [round, setRound] = useState(1);
    const [cardsThisRound, setCardsThisRound] = useState(0);

    const [roundHistory, setRoundHistory] = useState([]);
    const [gameHistory, setGameHistory] = useState({});

    /* ---------- TIMER ---------- */
    useEffect(() => {
        if (!started || timeUp) return;

        if (settings.roundType === "time" && timeLeft === 0) {
            setTimeUp(true);
            return;
        }

        const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, started, timeUp, settings.roundType]);

    /* ---------- HELPERS ---------- */
    const recordHistory = (result) => {
        const card = deck[index].title;
        const team = teams[currentTeam].name;

        setRoundHistory((r) => [...r, { card, result }]);

        setGameHistory((h) => ({
            ...h,
            [team]: {
                ...(h[team] || {}),
                [round]: [...(h[team]?.[round] || []), { card, result }],
            },
        }));
    };

    const applyScore = (delta) => {
        setTeams((ts) =>
            ts.map((t, i) =>
                i === currentTeam
                    ? { ...t, score: Math.max(0, t.score + delta) }
                    : t,
            ),
        );
    };

    const nextCard = (result) => {
        recordHistory(result);

        if (result === "success") applyScore(1);
        if (result === "skip") applyScore(settings.skipPenalty);

        setCardsThisRound((c) => c + 1);
        setIndex((i) => (i + 1) % deck.length);

        if (settings.roundType === "cards") {
            setTimeLeft(30);
            if (cardsThisRound + 1 >= 5) setTimeUp(true);
        }
    };

    const nextTeam = () => {
        const nextIndex = (currentTeam + 1) % teams.length;
        const completedRound = nextIndex === 0;

        if (completedRound && round >= settings.maxRounds) {
            setEnded(true);
            setStarted(false);
            return;
        }

        setCurrentTeam(nextIndex);
        if (completedRound) setRound((r) => r + 1);

        setCardsThisRound(0);
        setTimeLeft(30);
        setTimeUp(false);
        setRoundHistory([]);
    };

    /* ---------- SETUP SCREEN ---------- */
    if (!started && !ended) {
        return (
            <div className="app">
                <h1>Bible 30 Seconds</h1>

                <div className="card">
                    <div className="option-row">
                        <span>Number of Teams</span>
                        <select
                            value={teamCount ?? ""}
                            onChange={(e) => {
                                const count = Number(e.target.value);
                                setTeamCount(count);
                                setTeams(
                                    Array.from({ length: count }, (_, i) => ({
                                        name: `Team ${i + 1}`,
                                        score: 0,
                                    })),
                                );
                            }}
                        >
                            <option value="" disabled>
                                Select
                            </option>
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>

                    {teamCount && (
                        <div className="team-names">
                            {teams.map((t, i) => (
                                <div key={i} className="team-card">
                                    <span>Team {i + 1}</span>
                                    <input
                                        type="text"
                                        value={t.name}
                                        onChange={(e) =>
                                            setTeams((ts) =>
                                                ts.map((x, idx) =>
                                                    idx === i
                                                        ? {
                                                              ...x,
                                                              name: e.target
                                                                  .value,
                                                          }
                                                        : x,
                                                ),
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="options">
                        <div className="option-row">
                            <span>Skip costs −1</span>
                            <input
                                type="checkbox"
                                checked={settings.skipPenalty === -1}
                                onChange={(e) =>
                                    setSettings((s) => ({
                                        ...s,
                                        skipPenalty: e.target.checked ? -1 : 0,
                                    }))
                                }
                            />
                        </div>

                        <div className="option-row">
                            <span>
                                {settings.roundType === "time"
                                    ? "Round ends after 30 seconds"
                                    : "Round ends after 5 cards"}
                            </span>

                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.roundType === "cards"}
                                    onChange={(e) =>
                                        setSettings((s) => ({
                                            ...s,
                                            roundType: e.target.checked
                                                ? "cards"
                                                : "time",
                                        }))
                                    }
                                />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="option-row">
                            <span>End game after rounds</span>
                            <select
                                value={settings.maxRounds}
                                onChange={(e) =>
                                    setSettings((s) => ({
                                        ...s,
                                        maxRounds: Number(e.target.value),
                                    }))
                                }
                            >
                                {[10, 15, 20, 25].map((v) => (
                                    <option key={v} value={v}>
                                        {v}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <input
                            className="round-input-full"
                            type="number"
                            min="1"
                            placeholder="Custom number of rounds"
                            onChange={(e) =>
                                setSettings((s) => ({
                                    ...s,
                                    maxRounds:
                                        Number(e.target.value) || s.maxRounds,
                                }))
                            }
                        />
                    </div>
                </div>

                <button
                    disabled={!teamCount}
                    onClick={() => {
                        setDeck(shuffle(cards));
                        setTimeLeft(30);
                        setStarted(true);
                    }}
                >
                    Start Game
                </button>
            </div>
        );
    }

    /* ---------- GAME OVER ---------- */
    if (ended) {
        const max = Math.max(...teams.map((t) => t.score));
        const winners = teams.filter((t) => t.score === max);

        return (
            <div className="app">
                <h1>Game Over</h1>
                <h2>
                    Winner{winners.length > 1 ? "s" : ""}:{" "}
                    {winners.map((w) => `${w.name} (${w.score})`).join(", ")}
                </h2>

                {Object.entries(gameHistory).map(([team, rounds]) => (
                    <div key={team} className="card">
                        <h3>{team}</h3>
                        {Object.entries(rounds).map(([r, entries]) => (
                            <div key={r}>
                                <strong>Round {r}</strong>
                                <ul>
                                    {entries.map((e, i) => (
                                        <li key={i}>
                                            {e.result === "success"
                                                ? "✅"
                                                : "⛔"}{" "}
                                            {e.card}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    /* ---------- PLAY ---------- */
    const card = deck[index];
    const nextTeamName = teams[(currentTeam + 1) % teams.length].name;

    return (
        <div className="app">
            <h1>{timeLeft}s</h1>
            <h2>
                Round {round} — {teams[currentTeam].name}
            </h2>

            {!timeUp && (
                <>
                    <div className="card">
                        <h2>{card.title}</h2>
                        <ul>
                            {card.taboo.map((w, i) => (
                                <li key={i}>{w}</li>
                            ))}
                        </ul>
                    </div>

                    <button onClick={() => nextCard("success")}>Next</button>
                    <button className="skip" onClick={() => nextCard("skip")}>
                        Skip
                    </button>
                    <button className="quit" onClick={() => setEnded(true)}>
                        Quit
                    </button>
                </>
            )}

            {timeUp && (
                <div className="card">
                    <h3>Round {round} Summary</h3>
                    <ul>
                        {roundHistory.map((h, i) => (
                            <li key={i}>
                                {h.result === "success" ? "✅" : "⛔"} {h.card}
                            </li>
                        ))}
                    </ul>

                    <button className="next-team" onClick={nextTeam}>
                        Next Team: {nextTeamName}
                    </button>
                </div>
            )}
        </div>
    );
}
