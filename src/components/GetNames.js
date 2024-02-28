import React from 'react'
import '../styles/get-names.css'

function GetNames({ names, setNames, setIsGettingNames }) {
  function NameInput(name, i) {
    return (
      <div className='name-input-div' key={i}>
        <input type="text" maxLength="10" value={name} onChange={e => updatePlayer(e.target.value, i)} />
        <button title="Delete Player" onClick={() => deletePlayer(i)}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    );
  }

  function addPlayer() {
    setNames(prev => { return [...prev, 'Player ' + (prev.length + 1)]; })
  }

  function deletePlayer(i) {
    const newNames = names.filter((_, ind) => i !== ind);
    setNames(newNames);
  }

  function updatePlayer(name, i) {
    const newNames = [...names];
    newNames[i] = name;
    setNames(newNames);
  }

  function endGetNames() {
    setIsGettingNames(false);
  }

  return (
    <div className="get-names">
      <div className='names-box'>
        <h1>Cricket Scoring</h1>
        <h2>Names</h2>
        {names.map((name, i) => NameInput(name, i))}
        {names.length >= 4 && <button className='add-button' disabled>Add Player</button>}
        {names.length < 4 && <button className='add-button' onClick={addPlayer}>Add Player</button>}
        {names.length < 2 && <button className='start-game' onClick={endGetNames} disabled>Start Game</button>}
        {names.length >= 2 && <button className='start-game' onClick={endGetNames}>Start Game</button>}
      </div>
    </div>
  )
}

export default GetNames