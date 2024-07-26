import React, { useState, useEffect } from 'react';
import BoardTile from './BoardTile';
import axios from 'axios';
import HexagonGrid from './HexagonGrid';
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

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/units_items');
      const { seed, name, comp, activeTraits, traitThresholds } = response.data;

      setCompSeed(seed);
      setCompName(name);
      setActiveTraits(activeTraits);
      setTraitThresholds(traitThresholds);
      
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

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleRoll = () => {
    fetchUnits();
  };

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
    return <div className="loading"></div>;
  }

  if (error) {
    return <div className="error lol">Error: {error}</div>;
  }

  
  return (
<div className="tft-team-builder">
    <header className="app-header">
      <div className="app-title">
      <img src={process.env.PUBLIC_URL + '/assets/SillySprite.png'} alt="SillyTFT Icon" className="app-icon" />
      <div className="title-container">
          <h1 className="large-header">SillyTactics</h1>
          <h2 className="comp-name">{compName}</h2>
        </div>
      </div>
    </header>
      <div className="main-content">
        <div className="side-panel traits-panel">
          <h3>Active Traits</h3>
          {renderActiveTraits()}
        </div>
        <div className="board-container">
          <HexagonGrid tiles={userBoard} />
        </div>
        <div className="side-panel">
          <button className="roll-button" onClick={handleRoll}>Roblox Rng Simulator</button>
        </div>
      </div>
    </div>
  );
};

export default Board;