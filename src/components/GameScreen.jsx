export default function GameScreen({
    timeLeft,
    round,
    team,
    teams,
    card,
    timeUp,
    roundHistory,
    scoreFlash,
    currentTeamIndex,
    scoringInProgress,
    onNext,
    onSkip,
    onNextTeam,
    onQuit,
    nextTeamName,
}) {
    return (
        <div className="app">
            {/* TIMER & TURN */}
            <h1>{timeLeft}s</h1>
            <h2>
                Round {round} — {team.name}
            </h2>

            {/* SCOREBOARD */}
            <div className="scoreboard">
                {teams.map((t, i) => (
                    <div
                        key={i}
                        className={`score-item ${
                            i === currentTeamIndex ? "active" : ""
                        }`}
                    >
                        {t.name}: {t.score}
                    </div>
                ))}
            </div>

            {/* SCORE FLASH */}
            {scoreFlash && (
                <div
                    className={`score-flash ${
                        scoreFlash.delta > 0 ? "positive" : "negative"
                    }`}
                >
                    {scoreFlash.delta > 0
                        ? `+${scoreFlash.delta}`
                        : scoreFlash.delta}
                </div>
            )}

            {/* ACTIVE PLAY */}
            {!timeUp && (
                <>
                    <div className="card">
                        <h2>{card.title}</h2>
                        <ul>
                            {card.taboo.map((word, i) => (
                                <li key={i}>{word}</li>
                            ))}
                        </ul>
                    </div>

                    <button onClick={onNext} disabled={scoringInProgress}>
                        Next
                    </button>

                    <button
                        className="skip"
                        onClick={onSkip}
                        disabled={scoringInProgress}
                    >
                        Skip
                    </button>

                    <button className="quit" onClick={onQuit}>
                        Quit
                    </button>
                </>
            )}

            {/* ROUND END */}
            {timeUp && (
                <div className="card">
                    <h3>Round {round} Summary</h3>
                    <ul>
                        {roundHistory.map((entry, i) => (
                            <li key={i}>
                                {entry.result === "success" ? "✅" : "⛔"}{" "}
                                {entry.card}
                            </li>
                        ))}
                    </ul>

                    <button className="next-team" onClick={onNextTeam}>
                        Next Team: {nextTeamName}
                    </button>
                </div>
            )}
        </div>
    );
}
