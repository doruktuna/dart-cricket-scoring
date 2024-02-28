import React from 'react';
import '../styles/score-sheet.css'
import emptyMark from '../icons/empty-mark.svg';
import singleMark from '../icons/single-mark.svg';
import xMark from '../icons/x-mark.svg';
import circleWithX from '../icons/circle-with-x.svg';

function NamesRow({ leftPlayers, rightPlayers, curPlayer, isGameFinished }) {
  return (
    <div key='names-row' className="score-row">
      {leftPlayers.map(p => {
        let classNameStr = 'player-cell';
        if (!isGameFinished && p.id === curPlayer) {
          classNameStr += ' current-player';
        }
        return (
          <div key={p.name} className={classNameStr}>
            <pre>{p.name}</pre>
          </div>
        )
      })}

      <div key='shot-cell' className='shot-cell'><pre> </pre></div>

      {rightPlayers.map((p, i) => {
        let classNameStr = 'player-cell';
        classNameStr += i === (rightPlayers.length - 1) ? ' no-right-border' : '';
        if (!isGameFinished && p.id === curPlayer) {
          classNameStr += ' current-player';
        }

        return (
          <div key={p.name} className={classNameStr} >
            <pre>{p.name}</pre>
          </div>
        )
      })}
    </div >
  );
}

function ShotRow({ leftPlayers, rightPlayers, shotStr }) {
  return (
    <div key={shotStr} className="score-row">
      {leftPlayers.map(p => (
        <div key={p.name} className='player-cell'>
          <ShotIcon numShots={p.shots[shotStr]} />
        </div>
      ))}

      <div key={'shot-cell'} className='shot-cell'><pre>{shotStr}</pre></div>

      {rightPlayers.map((p, i) => (
        <div
          key={p.name}
          className={i === (rightPlayers.length - 1) ? 'player-cell no-right-border' : 'player-cell'}
        >
          <ShotIcon numShots={p.shots[shotStr]} />
        </div>
      ))}
    </div>
  );
}

function ShotIcon({ numShots }) {
  if (numShots === 0) { return <img src={emptyMark} alt=" " />; }
  if (numShots === 1) { return <img src={singleMark} alt="1" />; }
  if (numShots === 2) { return <img src={xMark} alt="2" />; }

  return <img src={circleWithX} alt="3+" />;
}

function ScoresRow({ leftPlayers, rightPlayers }) {
  return (
    <div key='scores' className="score-row">
      {leftPlayers.map(p => (
        <div key={p.name} className='player-cell no-bottom-border'>
          <pre>{p.score}</pre>
        </div>
      ))}

      <div key='shot-cell' className='shot-cell no-bottom-border'><pre> </pre></div>

      {rightPlayers.map((p, i) => (
        <div
          key={p.name}
          className={i === (rightPlayers.length - 1) ? 'player-cell no-bottom-border no-right-border' : 'player-cell no-bottom-border'}
        >
          <pre>{p.score}</pre>
        </div>
      ))
      }
    </div >
  );
}

function ScoreSheet({ players, curPlayer, availableShots, isGameFinished }) {
  const divPoint = Math.ceil(players.length / 2);
  const leftPlayers = players.filter((_, i) => i < divPoint);
  const rightPlayers = players.filter((_, i) => i >= divPoint);

  return (
    <div key="score-sheet" className="score-sheet">
      <NamesRow
        leftPlayers={leftPlayers}
        rightPlayers={rightPlayers}
        curPlayer={curPlayer}
        isGameFinished={isGameFinished}
      />

      {availableShots.map((shotStr, i) => (
        <ShotRow
          key={shotStr}
          shotStr={shotStr}
          leftPlayers={leftPlayers}
          rightPlayers={rightPlayers}
        />
      ))}

      <ScoresRow
        leftPlayers={leftPlayers}
        rightPlayers={rightPlayers}
      />
    </div >
  );
}

export default ScoreSheet;