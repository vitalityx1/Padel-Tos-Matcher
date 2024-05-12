    import React from "react";
    import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
    import {
    faUsers,
    faTrash,
    } from "@fortawesome/free-solid-svg-icons";

    function UserDiv() {
        const [playerNames, setPlayerNames] = React.useState(Array(12).fill(''));
        const [allRounds, setAllRounds] = React.useState([]);
        const [isCached, setIsCached] = React.useState(false);
        const [generationCount, setGenerationCount] = React.useState(0);
        React.useEffect(() => {
        const cachedRounds = localStorage.getItem('opgeslagenRondes');
        if (cachedRounds) {
            setAllRounds(JSON.parse(cachedRounds));
            setIsCached(true);
        }
        }, []);
        const handlePlayerNameChange = (index, event) => {
        const newPlayerNames = [...playerNames];
        newPlayerNames[index] = event.target.value;
        setPlayerNames(newPlayerNames);
        };
        const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
        };
        const generateRandomTeams = () => {
        const filledPlayerNames = playerNames.filter(name => name.trim() !== '');
        if (filledPlayerNames.length !== 12) {
            alert('Voer alstublieft 12 spelernamen in om teams te genereren.');
            return;
        }
        let rounds = [];
        let previousPartners = new Map();
        for (let gen = 0; gen < 3; gen++) {
            let shuffledPlayers;
            let validShuffle = false;
            shuffleLoop: while (!validShuffle) {
            shuffledPlayers = shuffleArray([...filledPlayerNames]);
            validShuffle = true;
            // Check if any of the shuffled pairs have played together before
            for (let i = 0; i < shuffledPlayers.length; i += 2) {
                const player1 = shuffledPlayers[i];
                const player2 = shuffledPlayers[i + 1];
                const partners1 = previousPartners.get(player1) || [];
                const partners2 = previousPartners.get(player2) || [];
                if (partners1.includes(player2) || partners2.includes(player1)) {
                validShuffle = false;
                continue shuffleLoop; // Continue shuffling if any pair has played together before
                }
            }
            // If we have a valid shuffle, update the previous partners map
            for (let i = 0; i < shuffledPlayers.length; i += 2) {
                const player1 = shuffledPlayers[i];
                const player2 = shuffledPlayers[i + 1];
                if (!previousPartners.has(player1)) previousPartners.set(player1, []);
                if (!previousPartners.has(player2)) previousPartners.set(player2, []);
                previousPartners.get(player1).push(player2);
                previousPartners.get(player2).push(player1);
            }
            }
            // Create courts for the current round
            const courts = [];
            for (let i = 0; i < shuffledPlayers.length; i += 4) {
            courts.push({
                court: Math.floor(i / 4) + 1,
                teamA: [shuffledPlayers[i], shuffledPlayers[i + 1]],
                teamB: [shuffledPlayers[i + 2], shuffledPlayers[i + 3]],
            });
            }
            rounds.push(courts);
            console.log(`Generated Teams Set ${gen + 1}:`, courts);
        }
        setAllRounds(rounds);
        setIsCached(true);
        setGenerationCount(1);
        localStorage.setItem('opgeslagenRondes', JSON.stringify(rounds));
        };
        const wipeResults = () => {
        if (window.confirm('Weet u zeker dat u de gegenereerde resultaten wilt verwijderen?')) {
            setAllRounds([]);
            setIsCached(false);
            setGenerationCount(0);
            setPlayerNames(Array(12).fill('')); // Reset player names
            localStorage.removeItem('opgeslagenRondes');
        }
        };
        return (

        <div className="bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 min-h-screen items-center justify-center pb-20 flex">
        <div className="p-4">
            {!isCached && generationCount < 1 && (
            <div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                {playerNames.map((name, index) => (
                    <input
                    key={index}
                    type="text"
                    placeholder={`Speler ${index + 1}`}
                    value={name}
                    onChange={(event) => handlePlayerNameChange(index, event)}
                    className="p-2 border rounded bg-white shadow w-full"
                    />
                ))}
                </div>
                <button
                onClick={generateRandomTeams}
                className="px-4 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300 mb-4 font-extrabold"
                >
                <FontAwesomeIcon icon={faUsers} /> Genereer Teams
                </button>
            </div>
            )}


            {isCached && (
            <div className="flex-auto">
            <button
                onClick={wipeResults}
                className="px-4 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-700 transition duration-300 font-extrabold"
            >
                <FontAwesomeIcon icon={faTrash} /> Verwijder resultaten
            </button>
            </div>
            )}
            <div className="flex-auto mt-4 ">
            {allRounds.map((round, roundIndex) => (
                <div key={roundIndex} className="flex-wrap mb-8 border p-4 rounded shadow-lg bg-white">
                <h2 className="text-xl font-bold mb-2">Ronde {roundIndex + 1}</h2>
                <div className="space-y-4">
                    {round.map((court, index) => (
                    <div key={index} className="p-4 border rounded shadow-lg bg-white">
                        <h3 className="text-lg font-bold mb-2">Baan {court.court}</h3>
                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-md font-bold mb-1">Team A</h4>
                            <p className="text-base">{court.teamA[0]}</p>
                            <p className="text-base">{court.teamA[1]}</p>
                        </div>
                        <div>
                            <h4 className="text-md font-bold mb-1">Team B</h4>
                            <p className="text-base">{court.teamB[0]}</p>
                            <p className="text-base">{court.teamB[1]}</p>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>  
        );
    }
    export default UserDiv;