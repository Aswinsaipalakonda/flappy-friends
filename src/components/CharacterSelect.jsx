import React from 'react';
import { characters } from '../assets/characters';

function CharacterSelect({ onSelectCharacter }) {
  return (
    <div className="screen character-select">
      <h1>Flappy Friends</h1>
      <p>Choose your Avatar</p>
      
      <div className="character-cards">
        {characters.map(char => (
          <div 
            key={char.id} 
            className="character-card"
            onClick={() => onSelectCharacter(char)}
          >
            <div className="img-wrapper">
               <img src={char.image} alt={char.name} />
            </div>
            <h3>{char.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CharacterSelect;
