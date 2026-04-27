export default function GameOverScreen({ teams, history, onReplay, onReturn }) {
    const maxScore = Math.max(...teams.map((t) => t.score));
    const winners = teams.filter((t) => t.score === maxScore);

    return (
        <div className="app">
            <h1>Game Over</h1>

            <h2>
                Winner{winners.length > 1 ? "s" : ""}:{" "}
                {winners.map((w) => `${w.name} (${w.score})`).join(", ")}
            </h2>

            <div className="gameover-actions">
                <button onClick={onReplay}>
                    Replay
                    <div className="button-subtext">same settings</div>
                </button>

                <button className="secondary" onClick={onReturn}>
                    Return
                </button>
            </div>

            {Object.entries(history).map(([team, rounds]) => (
                <div key={team} className="card">
                    <h3>{team}</h3>
                    {Object.entries(rounds).map(([round, entries]) => (
                        <div key={round}>
                            <strong>Round {round}</strong>
                            <ul>
                                {entries.map((e, i) => (
                                    <li key={i}>
                                        {e.result === "success" ? "✅" : "⛔"}{" "}
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
