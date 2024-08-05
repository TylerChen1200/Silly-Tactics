import React from 'react';
import './BoardTile.css';

const BoardTile = ({ tile }) => {
  const { champion } = tile;

  const getImagePath = (characterName) => {
    const formattedName = characterName.toLowerCase().replace(/ /g, '_');
    return `/assets/tft-champion/${formattedName}_mobile.tft_set12.png`;
  };

  const getItemImagePath = (itemName) => {
    let formattedName = itemName.toLowerCase().replace(/ /g, '_');
    formattedName = formattedName.replace(/'/g, '');
    const [prefix, ...rest] = formattedName.split('item_');
    const itemPart = rest.join('item_').replace(/_/g, '');
    const capitalizedItemPart = itemPart.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
    
    return `/assets/tft-item/TFT_Item_${capitalizedItemPart}.png`;
  };

  return (
    <div className={`board-tile ${!champion ? 'empty' : ''}`}>
      {champion && (
        <div className="champion-info">
          <img 
            src={getImagePath(champion.characterName)}
            alt={champion.characterName} 
            className="champion-icon"
          />
          <div className="champion-details">
            <span className="champion-cost">{champion.cost}</span>
          </div>
          <div className="items-container">
            {champion.items.slice(0, 3).map((item, index) => (
              <img 
                key={index} 
                src={getItemImagePath(item.id)}
                alt={item.name} 
                className="item-icon"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardTile;