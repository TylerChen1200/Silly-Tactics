import React from 'react';

const RandomTextDisplay = ({ texts }) => {
  return (
    <div className="random-text-display">
      <div className="text-rectangles">
        {texts.map((text, index) => (
          <div key={index} className="text-rectangle">
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RandomTextDisplay;