import React from 'react'


function ShotButtonRow({ dartScored, shot }) {
  return (
    <div className='shot-button-row'>

      <button
        key='single'
        className='shot-button single'
        onClick={() => { dartScored(shot, 1) }}
      >
        {shot}
      </button>

      <button
        key='double'
        className='shot-button double'
        onClick={() => { dartScored(shot, 2) }}
      >
        {'D-' + shot}
      </button>

      {shot !== 'BE' &&
        <button
          key='triple'
          className='shot-button triple'
          onClick={() => { dartScored(shot, 3) }}
        >
          {'T-' + shot}
        </button>
      }
    </div>
  )
}

function ShotButtons({ dartScored, passTurn, availableShots }) {
  return (
    <div key="shot-buttons" className="shot-buttons">
      {availableShots.map(shot => (
        <ShotButtonRow
          key={shot}
          dartScored={dartScored}
          shot={shot}
        />
      ))}
      <div key='pass' className='shot-button-row'>
        <button
          key='button-pass'
          className='shot-button pass'
          onClick={() => (passTurn())}
        >PASS</button>
      </div>
    </div>
  );
}

export default ShotButtons;