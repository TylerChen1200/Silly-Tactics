import React from 'react';
import BoardTile from './BoardTile'; 

const HexagonGrid = ({ tiles }) => {
  const renderRow = (start, end, extraLeft = false, extraRight = false) => {
    const rowTiles = tiles.slice(start, end);
    return (
      <div className="hex-row">
        {extraLeft && <BoardTile tile={{}} />}
        {rowTiles.map((tile, index) => (
          <BoardTile key={start + index} tile={tile} />
        ))}
        {extraRight && <BoardTile tile={{}} />}
      </div>
    );
  };

  return (
    <div className="hex-grid">
      {renderRow(0, 7, false, true)}  
      {renderRow(7, 14, true, false)} 
      {renderRow(14, 21, false, true)} 
      {renderRow(21, 28, true, false)} 
    </div>
  );
};

export default HexagonGrid;
