import React from "react";
import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  addDoc,
  query,
  serverTimestamp,
  orderBy,
  limitToLast,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faRedo,
  faSave,
  faUsers,
  faUndo,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

/**
 * UserDiv component for generating random teams for padel matches.
 * @returns {JSX.Element} The rendered UserDiv component.
 */
function UserDiv() {
  /**
   * State variables for players, teams, and UI flags.
   */
  const [players, setPlayers] = React.useState(Array(12).fill(""));
  const [teams, setTeams] = React.useState([]);
  const [showResults, setShowResults] = React.useState(false);
  const [showLanding, setShowLanding] = React.useState(true);

  /**
   * Handles the change of a player's name.
   * @param {number} index - The index of the player in the players array.
   * @param {string} value - The new value of the player's name.
   */
  const handlePlayerChange = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value.slice(0, 10); // Limit player name to 10 characters
    setPlayers(newPlayers);
  };

  /**
   * Generates teams randomly and saves player names to the database.
   */
  const generateTeams = async () => {
    const filledPlayers = players.filter((player) => player.trim() !== "");
    if (filledPlayers.length !== 12) {
      alert("Voer alstublieft precies 12 spelers in.");
      return;
    }
    let identifier = 1; // Declare the 'identifier' variable
    const playersCollectionRef = collection(db, "playersv1");
    filledPlayers.forEach(async (player,) => {
      await addDoc(playersCollectionRef, {
        name: player, 
        createdAt: serverTimestamp(), // This adds the timestamp to the Database
        id: identifier++, // Add the identifier
      }); 
    });
    // Shuffle the array of filled players
    const shuffledPlayers = filledPlayers.sort(() => 0.5 - Math.random());
    // Initialize an empty array for the generated teams
    const generatedTeams = [];
    // Loop through the shuffled players array
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      // For each pair of players, add them as a team to the generatedTeams array
      generatedTeams.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
    }

    setTeams(generatedTeams);
    setShowResults(true);
    setShowLanding(false);
  };

  /**
   * Regenerates teams randomly without saving player names to the database.
   */
  const RegenerateTeams = async () => {
    const filledPlayers = players.filter((player) => player.trim() !== "");
    const shuffledPlayers = filledPlayers.sort(() => 0.5 - Math.random());
    const RegenerateTeams = [];
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      RegenerateTeams.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
    }

    setTeams(RegenerateTeams);
    setShowResults(true);
    setShowLanding(false);
  };

  /**
   * Calls the RegenerateTeams function to reroll the teams.
   */
  const rerollTeams = async () => {
    await RegenerateTeams();
  };

  /**
   * Resets all state variables to their initial values.
   */
  const resetAll = () => {
    setPlayers(Array(12).fill(""));
    setTeams([]);
    setShowResults(false);
    setShowLanding(true);
  };

  /**
   * Switches to the second page of the UI.
   */
  const secondPage = () => {
    setShowResults(false);
    setShowLanding(false);
  };

  /**
   * Fetches the last 12 players from the database and updates the player names in the UI.
   */
  const fetchLast12Players = async () => {
    const playersCollectionRef = collection(db, "playersv1",);
    // Order by 'createdAt' in descending order so the most recent players come first, then limit to 12
    const q = query(
      playersCollectionRef,
      orderBy("createdAt", "asc"),
      limitToLast(12)
    );
    const querySnapshot = await getDocs(q);
    const fetchedPlayers = querySnapshot.docs.map((doc) => doc.data().name);
    // This ensures the text boxes are updated with the player names
    // Fills with fetched player names first, then empty strings if less than 12 players were fetched
    const newPlayersArray = [
      ...fetchedPlayers,
      ...Array(12 - fetchedPlayers.length).fill(""),
    ];

    setPlayers(newPlayersArray.map((name) => name || ""));
  };

  return (
    <div className="bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 min-h-screen flex flex-col items-center justify-center pb-20">
      {showLanding && (
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welkom bij de Deventer Padel Tos Matcher!
          </h1>
          <p className="text-blue-100 text-lg mb-6">
            Maak eerlijke en willekeurige teams voor je padelwedstrijden!
          </p>
          <button
            onClick={() => setShowLanding(false)}
            className="mt-4 px-6 py-3 bg-white text-blue-700 rounded-full hover:bg-blue-100 transition duration-300 shadow-lg"
          >
            <FontAwesomeIcon icon={faPlay} /> Begin
          </button>
        </div>
      )}
      {!showResults && !showLanding && (
        <div className="p-4 w-9/12 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {players.map((player, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Speler ${index + 1}`}
                value={player}
                onChange={(e) => handlePlayerChange(index, e.target.value)}
                className="p-2 border rounded bg-white shadow w-full"
                maxLength="10"
              />
            ))}
          </div>
          <div className="text-center mt-6 space-x-5 space-y-4">
            <button
              onClick={generateTeams}
              className="px-6 py-3 bg-white text-blue-700 rounded-full hover:bg-blue-100 transition duration-300 shadow-lg"
            >
              <FontAwesomeIcon icon={faUsers} /> Genereer Teams
            </button>
            <button
              onClick={fetchLast12Players}
              className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 shadow-lg"
            >
              <FontAwesomeIcon icon={faSave} /> Laad opgeslagen spelers
            </button>
          </div>
        </div>
      )}
      {showResults && (
        <div className="p-4 w-full max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Koppels:
            </h2>
            <p className="text-blue-100 text-base md:text-lg mb-6">
              Hieronder vind je de willekeurige gekozen teams
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team, index) => (
              <div
                key={index}
                className="border p-4 rounded shadow-lg bg-white"
              >
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-blue-700">
                  Team {Math.floor(index / 2) + 1}
                  {index % 2 === 0 ? "A" : "B"}:
                </h3>
                <p className="text-blue-600">{team[0]}</p>
                <p className="text-blue-600">{team[1]}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6 space-x-4">
            <button
              onClick={rerollTeams}
              className="px-4 md:px-6 py-2 md:py-3 bg-white text-blue-700 rounded-full hover:bg-blue-100 transition duration-300 shadow-lg"
            >
              <FontAwesomeIcon icon={faRedo} /> Opnieuw rollen
            </button>
            <button
              onClick={secondPage}
              className="px-4 md:px-6 py-2 md:py-3 bg-white text-blue-700 rounded-full hover:bg-blue-100 transition duration-300 shadow-lg"
            >
              <FontAwesomeIcon icon={faUndo} /> Vorige stap
            </button>
            <button
              onClick={resetAll}
              className="px-4 md:px-6 py-2 md:py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 shadow-lg"
            >
              <FontAwesomeIcon icon={faTrash} /> Begin opnieuw
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default UserDiv;
