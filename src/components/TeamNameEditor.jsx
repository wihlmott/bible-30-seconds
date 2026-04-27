function TeamNameEditor({ teams, setTeams }) {
    const handleNameChange = (index, value) => {
        setTeams((prevTeams) =>
            prevTeams.map((team, i) => {
                if (i !== index) return team;

                const trimmed = value.trim();

                return {
                    ...team,
                    name: trimmed.length > 0 ? trimmed : `Team ${index + 1}`,
                };
            }),
        );
    };

    return (
        <div className="team-names">
            {teams.map((team, index) => (
                <div key={index} className="team-card">
                    <span>Team {index + 1}</span>
                    <input
                        type="text"
                        value={team.name}
                        placeholder={`Team ${index + 1}`}
                        onChange={(e) =>
                            handleNameChange(index, e.target.value)
                        }
                    />
                </div>
            ))}
        </div>
    );
}

export default TeamNameEditor;
