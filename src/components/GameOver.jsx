import React from 'react';

function GameOver({ score, onRestart }) {
  return (
    <div className="game-over-overlay">
      <div className="game-over-modal">
        <h2>Game Over</h2>
        <p>Score: {score}</p>
        <button className="restart-btn" onClick={onRestart}>
          Restart
        </button>
      </div>
    </div>
  );
}

export default GameOver;
