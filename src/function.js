import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRedo,
  faUsers,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

// UserDiv component
function UserDiv() {
  const [playerNames, setPlayerNames] = React.useState(Array(12).fill(''));
  const [courts, setCourts] = React.useState([]);
  const [isCached, setIsCached] = React.useState(false);
  React.useEffect(() => {
    // Load cached teams from localStorage on component mount
    const cachedCourts = localStorage.getItem('cachedCourts');
    if (cachedCourts) {
      setCourts(JSON.parse(cachedCourts));
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
  const shuffleTeams = () => {
    if (courts.length === 0) {
      alert('No cached teams to shuffle. Please generate teams first.');
      return;
    }
    // Shuffle only the players within the cached teams
    const players = courts.flatMap(court => [...court.teamA, ...court.teamB]);
    const shuffledPlayers = shuffleArray(players);
    const shuffledCourts = [];
    for (let i = 0; i < shuffledPlayers.length; i += 4) {
      shuffledCourts.push({
        court: Math.floor(i / 4) + 1,
        teamA: [shuffledPlayers[i], shuffledPlayers[i + 1]],
        teamB: [shuffledPlayers[i + 2], shuffledPlayers[i + 3]],
      });
    }
    setCourts(shuffledCourts);
    localStorage.setItem('cachedCourts', JSON.stringify(shuffledCourts));
  };
  const generateRandomTeams = () => {
    const filledPlayerNames = playerNames.filter(name => name.trim() !== '');
    if (filledPlayerNames.length !== 12) {
      alert('Please enter 12 player names to generate teams.');
      return;
    }
    const shuffledPlayers = shuffleArray([...filledPlayerNames]);
    const generatedCourts = [];
    for (let i = 0; i < shuffledPlayers.length; i += 4) {
      generatedCourts.push({
        court: Math.floor(i / 4) + 1,
        teamA: [shuffledPlayers[i], shuffledPlayers[i + 1]],
        teamB: [shuffledPlayers[i + 2], shuffledPlayers[i + 3]],
      });
    }
    setCourts(generatedCourts);
    setIsCached(true);
    localStorage.setItem('cachedCourts', JSON.stringify(generatedCourts));
  };
  const wipeCachedResults = () => {
    localStorage.removeItem('cachedCourts');
    setCourts([]);
    setIsCached(false);
    setPlayerNames(Array(12).fill('')); // Reset player names
  };
  return (
    
    <div className="bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 min-h-screen flex flex-col items-center justify-center pb-20">
    <div className="p-4">
    {!isCached && (
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
    )}
      {!isCached && (
      <button
        onClick={generateRandomTeams}
        className="px-4 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300 mb-4 font-extrabold"
      >
        <FontAwesomeIcon icon={faUsers} />Genereer Teams
      </button>
        )}
      {isCached && (
        <div className="flex space-x-5">
          <button
            onClick={shuffleTeams}
            className="px-4 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-700 transition duration-300 font-extrabold"
          >
            <FontAwesomeIcon icon={faRedo} /> Opnieuw rollen
          </button>
          <button
            onClick={wipeCachedResults}
            className="px-4 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-700 transition duration-300 font-extrabold"
          >
            <FontAwesomeIcon icon={faTrash} /> Verwijder resultaten
          </button>
        </div>
      )}
      <div className="mt-4">
        {courts.length > 0 && (
          <div className="space-y-4">
            {courts.map((court, index) => (
              <div key={index} className="border p-4 rounded shadow-lg bg-white">
                <h3 className="text-lg font-bold mb-2">Baan {court.court}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold mb-1">Team A</h4>
                    <p>{court.teamA[0]}</p>
                    <p>{court.teamA[1]}</p>
                  </div>
                  <div>
                    <h4 className="text-md font-bold mb-1">Team B</h4>
                    <p>{court.teamB[0]}</p>
                    <p>{court.teamB[1]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default UserDiv;
