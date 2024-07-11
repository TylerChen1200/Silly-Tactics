import React from 'react';
import HexagonGrid from './HexagonGrid';

const TeamBuilder = () => {
  
  const tiles = Array(28).fill().map((_, index) => ({
    champion: {
      characterName: `Champion ${index + 1}`, 
      cost: 3,
      items: [
        { name: `Item 1` },
        { name: `Item 2` }
      ]
    }
  }));

  return (
    <div className="team-builder">
      <h1>Who let me cook</h1>
      <p>No active synergies</p>
      <HexagonGrid tiles={tiles} />
    </div>
  );
};

export default TeamBuilder;
