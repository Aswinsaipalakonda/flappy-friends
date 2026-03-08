import React, { useState } from 'react';
import CharacterSelect from './components/CharacterSelect';
import GameCanvas from './components/GameCanvas';

function App() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const selectCharacter = (char) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedCharacter(char);
      setIsTransitioning(false);
    }, 400); // Wait for fade out
  };

  const returnToMenu = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedCharacter(null);
      setIsTransitioning(false);
    }, 400);
  };

  return (
    <div className="screenApp">
      {!selectedCharacter ? (
        <CharacterSelect onSelectCharacter={selectCharacter} />
      ) : (
        <GameCanvas 
          character={selectedCharacter} 
          onReturnToMenu={returnToMenu} 
        />
      )}
      {isTransitioning && <div className="transition-overlay" />}
    </div>
  );
}

export default App;
