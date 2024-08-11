import React, { useState, useEffect } from 'react';
import BoardTile from './BoardTile';
import axios from 'axios';
import HexagonGrid from './HexagonGrid';
import RandomAugmentDisplay from './RandomAugmentDisplay';
import './Board.css';
import { API_BASE_URL, API_UNITS_ITEMS_URL } from './config';

const ROWS = 4;
const TILES_PER_ROW = 7;

const api = axios.create({
  baseURL: API_BASE_URL,
});

const Board = () => {
  const [userBoard, setUserBoard] = useState([]);
  const [compName, setCompName] = useState('');
  const [compSeed, setCompSeed] = useState('');
  const [activeTraits, setActiveTraits] = useState({});
  const [traitThresholds, setTraitThresholds] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [augmentTexts, setAugmentTexts] = useState(['', '', '']);

  const options = ["Left", "Middle", "Right"];

  const generateRandomTexts = () => {
    return Array(3).fill().map(() => options[Math.floor(Math.random() * options.length)]);
  };

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_UNITS_ITEMS_URL);
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
    setAugmentTexts(generateRandomTexts());
  }, []);

  const handleRoll = () => {
    fetchUnits();
    setAugmentTexts(generateRandomTexts());
  };

  const renderActiveTraits = () => {
    if (!activeTraits || typeof activeTraits !== 'object') {
      console.error('activeTraits is not an object:', activeTraits);
      return <div>No active traits available</div>;
    }
  
    const entries = Object.entries(activeTraits);
  
    if (entries.length === 0) {
      return <div>No active traits</div>;
    }
  
    return entries
      .sort(([, a], [, b]) => (b.count || 0) - (a.count || 0))
      .map(([trait, traitData]) => {
        if (!traitData || typeof traitData !== 'object') {
          console.error('Invalid trait data for', trait, ':', traitData);
          return null;
        }
  
        const { count = 0, activeLevel = 0, maxLevel = 1 } = traitData;
        
        let nextThreshold = count;
        if (traitThresholds && traitThresholds[trait]) {
          nextThreshold = activeLevel < maxLevel ? 
            traitThresholds[trait][activeLevel] || count : 
            traitThresholds[trait][maxLevel - 1] || count;
        }
  
        return (
          <div key={trait} className="trait-item">
            <span className="trait-name">{trait}</span>
            <span className="trait-count">{count}/{nextThreshold}</span>
          </div>
        );
      })
      .filter(Boolean); 
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
          {renderActiveTraits()}
        </div>
      </div>
    </div>
  );
};

export default Board;