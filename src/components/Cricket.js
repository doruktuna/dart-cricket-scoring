import React, { useEffect, useState } from 'react'
import GetNames from './GetNames';
import ScoreSheet from './ScoreSheet';
import ShotButtons from './ShotButtons';
import '../styles/cricket.css';

function Cricket() {
  const MAX_TURNS = 25;
  const availableShots = ['20', '19', '18', '17', '16', '15', 'BE'];

  const [names, setNames] = useState(['Player 1', 'Player 2']);
  const [players, setPlayers] = useState([]);
  const [turn, setTurn] = useState(1);
  const [curPlayer, setCurPlayer] = useState(0);
  const [curShotNo, setCurShotNo] = useState(1);
  const [isGameFinished, setIsGameFinished] = useState(true);
  const [isGettingNames, setIsGettingNames] = useState(true);
  const [winnerNames, setWinnerNames] = useState(null);

  // Load data when the page is first loaded
  useEffect(() => {
    const loadDataRaw = localStorage.getItem("CRICKET_DATA");
    if (loadDataRaw) {
      const data = JSON.parse(loadDataRaw);
      setNames(data.names);
      setPlayers(data.players);
      setTurn(data.turn);
      setCurPlayer(data.curPlayer);
      setCurShotNo(data.curShotNo);
      setIsGameFinished(data.isGameFinished);
      setIsGettingNames(data.isGettingNames);
      setWinnerNames(data.winnerNames);
    }
  }, []);

  // Save data when a state changes
  useEffect(() => {
    const saveData = {
      names,
      players,
      turn,
      curPlayer,
      curShotNo,
      isGameFinished,
      isGettingNames,
      winnerNames
    }
    localStorage.setItem("CRICKET_DATA", JSON.stringify(saveData));
  }, [names, players, turn, curPlayer, curShotNo, isGameFinished, isGettingNames, winnerNames]);

  useEffect(() => {
    if (!isGettingNames && isGameFinished) {
      startGame();
    }
  }, [names]);


  // If game is just started, reset states
  useEffect(() => {
    if (!isGettingNames && isGameFinished) {
      startGame();
    }
  }, [isGettingNames]);

  // Announce the winner when game is finished
  useEffect(() => {
    if (!isGettingNames && isGameFinished) {
      evaluateWinners();
    }
  }, [isGameFinished]);

  // Update to next player when 3 shots are made
  // (Pass also sets shots to 4)
  useEffect(() => {
    if (curShotNo > 3) {
      if (curPlayer === players.length - 1) {
        setCurPlayer(0);
        setTurn(turn + 1);
      } else {
        setCurPlayer(curPlayer + 1);
      }
      setCurShotNo(1);
    }
  }, [curShotNo]);

  // Finish game after MAX_TURNS turns
  useEffect(() => {
    if (turn > MAX_TURNS) {
      setIsGameFinished(true);
      setTurn(MAX_TURNS);
    }
  }, [turn]);

  function startGame() {
    const zeroShots = availableShots.reduce((acc, scoreStr) => {
      acc[scoreStr] = 0;
      return acc;
    }, {});
    const players = names.map((name, i) => ({
      id: i,
      name: name,
      shots: { ...zeroShots },
      score: 0
    }));
    setPlayers(players);
    setTurn(1);
    setCurPlayer(0);
    setCurShotNo(1);
    setIsGameFinished(false);
    setWinnerNames(null);
  }

  function evaluateWinners() {
    const minScore = players.reduce((minScore, player) => {
      return minScore < player.score ? minScore : player.score;
    }, players[0].score)
    console.log("Min score is: " + minScore);

    const winners = players.filter(player => player.score === minScore);
    const winnerNames = winners.map(player => player.name);
    console.log("Winner names: " + winnerNames);

    setWinnerNames(winnerNames);
  }

  function updateScores(scoreStr, scoreTimes) {
    let scoreVal = 25;
    if (scoreStr !== 'BE') { scoreVal = Number(scoreStr); }
    const scoreTotal = scoreTimes * scoreVal;

    let newPlayers = [...players];
    newPlayers.forEach(player => {
      if (player.shots[scoreStr] < 3) {
        console.log("Adding: " + scoreTotal + " to " + player.name);
        player.score += scoreTotal;
      }
    });

    setPlayers(newPlayers);
  }

  // A player wins before the end of turns only if:
  // 1) They has scored at least 3 times for all shots
  // 2) They have the minimum score
  function checkForWinner() {
    const candidate = players[curPlayer];

    const lesserShots = Object.entries(candidate.shots).filter(([_, val]) => val < 3)
    if (lesserShots.length > 0) { return; }

    const candScore = candidate.score;
    const lesserScores = players.filter((player, i) => (i !== curPlayer && candScore >= player.score));
    if (lesserScores.length > 0) { return; }

    console.log("We have a winner by closing all shots: " + candidate.name);

    setIsGameFinished(true);
  }

  function dartScored(scoreStr, times) {
    console.log(players[curPlayer].name + " scored " + scoreStr + ", " + times + " times.");

    // Update player's shots
    const updatedPlayer = { ...players[curPlayer] };
    updatedPlayer.shots[scoreStr] += times;

    const newPlayers = [...players];
    players[curPlayer] = updatedPlayer;
    setPlayers(newPlayers);

    // Update others scores
    if (updatedPlayer.shots[scoreStr] > 3) {
      const scoreTimes = Math.min(times, updatedPlayer.shots[scoreStr] - 3);
      console.log(updatedPlayer.name + " scores: " + scoreTimes + " x " + scoreStr);
      updateScores(scoreStr, scoreTimes);
    }

    checkForWinner();
    setCurShotNo(curShotNo + 1);
  }

  function passTurn() {
    setCurShotNo(4);
  }

  function restartGame() {
    startGame()
  }

  function newGame() {
    setIsGameFinished(true);
    setIsGettingNames(true);
  }

  function InfoBox() {
    return (
      <div key="info-box" className="info-box">
        <span>Turn: {turn}/{MAX_TURNS}</span>

        {!isGameFinished && <span>{players[curPlayer].name}'s turn</span>}
        {!isGameFinished && <span>Shot: {curShotNo}/3</span>}
        {isGameFinished && winnerNames && <WinnerInfo />}

        <button onClick={restartGame}>RESTART</button>
        <button onClick={newGame}>NEW GAME</button>
      </div>
    );
  }

  function WinnerInfo() {
    let winnerStr = '';
    if (winnerNames.length === 1) {
      winnerStr = "Winner: " + winnerNames[0];
    } else if (winnerNames.length === 2) {
      winnerStr = "Winners: " + winnerNames.join(" and ");
    } else {
      winnerStr = "Winners: " + winnerNames.join(", ");
    }

    return (
      <div>
        <span>Game Finished</span>
        <span>{winnerStr}</span>
      </div>
    );
  }

  return (
    <div key='cricket' className='cricket'>
      {isGettingNames &&
        <GetNames
          names={names}
          setNames={setNames}
          setIsGettingNames={setIsGettingNames}
        />
      }
      {!isGettingNames && !isGameFinished &&
        <ShotButtons
          dartScored={dartScored}
          passTurn={passTurn}
          availableShots={availableShots}
        />
      }
      {!isGettingNames &&
        <ScoreSheet
          players={players}
          curPlayer={curPlayer}
          availableShots={availableShots}
          isGameFinished={isGameFinished}
        />
      }
      {!isGettingNames && <InfoBox />}
    </div >
  );
}

export default Cricket;


/*

Data to track:
- Players
  x id (1, 2, 3, 4)
  x Name
  x Shots
  x Score
- Turn number
- Game finished


UI:
- Get player's name before the game
  x Add, delete functionality
- X's turn on top (Or game finished)
- Players, shots, score like a grid structure (usuall dart scoring)
- Buttons for entering shots (Pass button too)
- Buttons for starting a new game
- Winner announcement
  x Announce winner
  x Buttons for restarting the game and new game


Logic:
- Take shots from a player
  x Pass turn to next one after 3 shots or pass
  x If a player closed all shots + he is 1st => announce the winner
- Update turn after last player's turn
  x If turns end announce the winner

*/