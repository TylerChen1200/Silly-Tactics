import React, { useState, useEffect } from 'react';
import BoardTile from './BoardTile';
import axios from 'axios';
import './Board.css';

const ROWS = 4;
const TILES_PER_ROW = 7;

const Board = () => {
  const [userBoard, setUserBoard] = useState([]);
  const [compName, setCompName] = useState('');
  const [compSeed, setCompSeed] = useState('');
  const [activeTraits, setActiveTraits] = useState({});
  const [traitThresholds, setTraitThresholds] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get('/api/units_items');
        const { seed, name, comp, activeTraits, traitThresholds } = response.data;

        setCompSeed(seed);
        setCompName(name);
        setActiveTraits(activeTraits);
        setTraitThresholds(traitThresholds);
        
        console.log('trait threshold:', traitThresholds)

        const newBoard = Array(ROWS * TILES_PER_ROW).fill().map(() => ({ champion: null }));

        for (const unit of comp) {
          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * newBoard.length);
          } while (newBoard[randomIndex].champion);
          newBoard[randomIndex] = { champion: unit };
        }

        setUserBoard(newBoard);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  const renderActiveTraits = () => {
    return Object.entries(activeTraits)
      .sort(([, a], [, b]) => b.count - a.count)
      .map(([trait, { count, activeLevel, maxLevel }]) => {
        const nextThreshold = activeLevel < maxLevel ? 
          traitThresholds[trait][activeLevel] : 
          traitThresholds[trait][maxLevel - 1];
        
        return (
          <div key={trait} className="trait-item">
            <span className="trait-name">{trait}</span>
            <span className="trait-count">{count}/{nextThreshold}</span>
          </div>
        );
      });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="tft-team-builder">
      <header>
        <h1>Who let me cook</h1>
        <h2>{compName}</h2>
      </header>
      <div className="main-content">
        <div className="side-panel traits-panel">
          <h3>Active Traits</h3>
          {renderActiveTraits()}
        </div>
        <div className="board-container">
          <div className="board">
            {userBoard.map((tile, index) => (
              <BoardTile key={index} tile={tile} />
            ))}
          </div>
        </div>
        <div className="side-panel">
          <p>No equipped items</p>
        </div>
      </div>
    </div>
  );
};

export default Board;