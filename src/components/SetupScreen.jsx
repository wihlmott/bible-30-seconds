import ToggleSwitch from "./ToggleSwitch";
import TeamNameEditor from "./TeamNameEditor";

export default function SetupScreen({
    teamCount,
    setTeamCount,
    teams,
    setTeams,
    settings,
    setSettings,
    onStart,
}) {
    return (
        <div className="app">
            <h1>Bible Taboo</h1>

            <div className="card">
                {/* Number of teams */}
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

                {/* Team name editor (only after team count selected) */}
                {teamCount && (
                    <TeamNameEditor teams={teams} setTeams={setTeams} />
                )}

                <div className="options">
                    {/* Skip penalty */}
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

                    {/* Round type toggle */}
                    <div className="option-row">
                        <span>
                            {settings.roundType === "time"
                                ? "Round ends after time"
                                : "Round ends after 5 cards"}
                        </span>

                        <ToggleSwitch
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
                    </div>

                    {/* ✅ Time selector — ONLY visible if roundType === "time" */}
                    {settings.roundType === "time" && (
                        <div className="option-row">
                            <span>Time per round</span>
                            <select
                                value={settings.roundSeconds}
                                onChange={(e) =>
                                    setSettings((s) => ({
                                        ...s,
                                        roundSeconds: Number(e.target.value),
                                    }))
                                }
                            >
                                {[30, 45, 60].map((v) => (
                                    <option key={v} value={v}>
                                        {v}s
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* End condition */}
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

            <button disabled={!teamCount} onClick={onStart}>
                Start Game
            </button>
        </div>
    );
}
