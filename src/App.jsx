import { useEffect, useState } from "react";
import cards from "./data/cards";
import { shuffle } from "./utils/shuffle";

import SetupScreen from "./components/SetupScreen";
import GameScreen from "./components/GameScreen";
import GameOverScreen from "./components/GameOverScreen";

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
        roundSeconds: 30,
    });

    const [round, setRound] = useState(1);
    const [cardsThisRound, setCardsThisRound] = useState(0);

    const [roundHistory, setRoundHistory] = useState([]);
    const [gameHistory, setGameHistory] = useState({});

    const [scoreFlash, setScoreFlash] = useState(null);
    const scoringInProgress = scoreFlash !== null;

    /* ---------- TIMER ---------- */
    useEffect(() => {
        if (!started || timeUp) return;

        if (settings.roundType === "time" && timeLeft === 0) {
            setTimeUp(true);
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft((t) => t - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, started, timeUp, settings.roundType]);

    /* ---------- HISTORY ---------- */
    const recordHistory = (result) => {
        const cardTitle = deck[index].title;
        const teamName = teams[currentTeam].name;

        setRoundHistory((rh) => [...rh, { card: cardTitle, result }]);

        setGameHistory((h) => ({
            ...h,
            [teamName]: {
                ...(h[teamName] || {}),
                [round]: [
                    ...(h[teamName]?.[round] || []),
                    { card: cardTitle, result },
                ],
            },
        }));
    };

    /* ---------- SCORING ---------- */
    const applyScore = (delta) => {
        setTeams((ts) =>
            ts.map((t, i) =>
                i === currentTeam
                    ? { ...t, score: Math.max(0, t.score + delta) }
                    : t,
            ),
        );

        setScoreFlash({ teamIndex: currentTeam, delta });

        setTimeout(() => {
            setScoreFlash(null);
        }, 700);
    };
    /* ---------- CARD ACTIONS ---------- */
    const advanceCard = () => {
        setCardsThisRound((c) => c + 1);
        setIndex((i) => (i + 1) % deck.length);

        if (settings.roundType === "cards") {
            setTimeLeft(settings.roundSeconds);
            if (cardsThisRound + 1 >= 5) {
                setTimeUp(true);
            }
        }
    };

    const handleNext = () => {
        recordHistory("success");
        applyScore(1);
        advanceCard();
    };

    const handleSkip = () => {
        recordHistory("skip");
        applyScore(settings.skipPenalty);
        advanceCard();
    };

    /* ---------- ROUND / TEAM FLOW ---------- */
    const handleNextTeam = () => {
        const nextIndex = (currentTeam + 1) % teams.length;
        const completedRound = nextIndex === 0;

        if (completedRound && round >= settings.maxRounds) {
            setEnded(true);
            setStarted(false);
            return;
        }

        setCurrentTeam(nextIndex);
        if (completedRound) {
            setRound((r) => r + 1);
        }

        setCardsThisRound(0);
        setTimeLeft(settings.roundSeconds);
        setTimeUp(false);
        setRoundHistory([]);
    };

    /* ---------- SETUP SCREEN ---------- */
    if (!started && !ended) {
        return (
            <SetupScreen
                teamCount={teamCount}
                setTeamCount={setTeamCount}
                teams={teams}
                setTeams={setTeams}
                settings={settings}
                setSettings={setSettings}
                onStart={() => {
                    setDeck(shuffle(cards));
                    setIndex(0);
                    setCurrentTeam(0);
                    setRound(1);
                    setCardsThisRound(0);
                    setRoundHistory([]);
                    setGameHistory({});
                    setTimeLeft(settings.roundSeconds);
                    setTimeUp(false);
                    setStarted(true);
                }}
            />
        );
    }

    /* ---------- GAME OVER SCREEN ---------- */
    if (ended) {
        return (
            <GameOverScreen
                teams={teams}
                history={gameHistory}
                onReplay={() => {
                    setDeck(shuffle(cards));
                    setIndex(0);
                    setCurrentTeam(0);
                    setRound(1);
                    setCardsThisRound(0);
                    setRoundHistory([]);
                    setGameHistory({});
                    setTimeLeft(settings.roundSeconds);
                    setTimeUp(false);
                    setEnded(false);
                    setStarted(true);
                }}
                onReturn={() => {
                    setDeck(shuffle(cards));
                    setIndex(0);
                    setCurrentTeam(0);
                    setRound(1);
                    setCardsThisRound(0);
                    setRoundHistory([]);
                    setGameHistory({});
                    setTimeUp(false);
                    setEnded(false);
                    setStarted(false);
                }}
            />
        );
    }

    /* ---------- GAME SCREEN ---------- */
    return (
        <GameScreen
            timeLeft={timeLeft}
            round={round}
            team={teams[currentTeam]}
            teams={teams}
            card={deck[index]}
            timeUp={timeUp}
            roundHistory={roundHistory}
            scoreFlash={scoreFlash}
            currentTeamIndex={currentTeam}
            scoringInProgress={scoringInProgress}
            onNext={handleNext}
            onSkip={handleSkip}
            onNextTeam={handleNextTeam}
            onQuit={() => setEnded(true)}
            nextTeamName={teams[(currentTeam + 1) % teams.length].name}
        />
    );
}
