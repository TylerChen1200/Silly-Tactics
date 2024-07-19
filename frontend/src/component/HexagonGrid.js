import React from 'react';
import BoardTile from './BoardTile'; 
import './HexagonGrid.css';

const HexagonGrid = ({ tiles }) => {
  const renderRow = (start, end, isOffset) => {
    const rowTiles = tiles.slice(start, end);
    return (
      <div className={`hex-row ${isOffset ? 'offset' : ''}`}>
        {rowTiles.map((tile, index) => (
          <BoardTile key={start + index} tile={tile} />
        ))}
      </div>
    );
  };

  return (
    <div className="hex-grid">
      {renderRow(0, 7, false)}
      {renderRow(7, 14, true)}
      {renderRow(14, 21, false)}
      {renderRow(21, 28, true)}
    </div>
  );
};

export default HexagonGrid;