import React, { useState } from 'react';


import { parseFEN } from '../Utilities/parseFEN';
import './Board.scss';
import {
  validAdvisorMoves, 
  validCannonMoves, 
  validChariotMoves, 
  validElephantMoves,
  validGeneralMoves,
  validHorseMoves,
  validSoldierMoves 
} from '../Utilities/validateMoves.js';


const XiangqiBoard = () => {
  const initialFen = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR';
  const [gameState, setGameState] = useState({
    board: parseFEN(initialFen),
    selectedPiece: null,
    selectedPosition: null,
    validMoves: [],
    moveHistory: [],
    fen: initialFen,
    turn: 'r'
  });

  const pieceRules = {
    r_chariot: validChariotMoves,
    r_horse: validHorseMoves,
    r_elephant: validElephantMoves,
    r_advisor: validAdvisorMoves,
    r_general: validGeneralMoves,
    r_cannon: validCannonMoves,
    r_soldier: validSoldierMoves,
    b_chariot: validChariotMoves,
    b_horse: validHorseMoves,
    b_elephant: validElephantMoves,
    b_advisor: validAdvisorMoves,
    b_general: validGeneralMoves,
    b_cannon: validCannonMoves,
    b_soldier: validSoldierMoves,
  };

  const pieceToFEN = {
    'r_chariot': 'r',
    'r_horse': 'h',
    'r_elephant': 'e',
    'r_advisor': 'a',
    'r_general': 'g',
    'r_cannon': 'c',
    'r_soldier': 's',
    'b_chariot': 'R',
    'b_horse': 'H',
    'b_elephant': 'E',
    'b_advisor': 'A',
    'b_general': 'G',
    'b_cannon': 'C',
    'b_soldier': 'S',
    null: '1' 
  };
  
  const updateFEN = (board) => {
    let fen = '';
  
    for (let row of board) {
      let emptyCount = 0;
  
      for (let cell of row) {
        const pieceFEN = pieceToFEN[cell] || '';
  
        if (pieceFEN === '1') {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            fen += emptyCount;
            emptyCount = 0;
          }
          fen += pieceFEN;
        }
      }
  
      if (emptyCount > 0) {
        fen += emptyCount;
      }
  
      fen += '/';
    }
    return fen.slice(0, -1);
  };  

  const handleCellClick = (rowIndex, colIndex) => {
    const { board, selectedPiece, selectedPosition, turn } = gameState;
    const piece = board[rowIndex][colIndex];
  
    if (selectedPiece) {
      // If a piece is already selected and the user clicks on another piece of the same color, change the selected piece
      if (piece && piece[0] === turn) {
        const moves = getValidMoves(rowIndex, colIndex);
        setGameState(prevState => ({
          ...prevState,
          selectedPiece: piece,
          selectedPosition: [rowIndex, colIndex],
          validMoves: moves
        }));
      } else if (isMoveValid(selectedPosition[0], selectedPosition[1], rowIndex, colIndex)) {
        // If the clicked cell is a valid move, perform the move
        const newBoard = board.map(row => row.slice()); // Clone the board
        const [prevRow, prevCol] = selectedPosition;
        const movedPiece = newBoard[prevRow][prevCol];
        const capturedPiece = newBoard[rowIndex][colIndex];
  
        newBoard[rowIndex][colIndex] = movedPiece;
        newBoard[prevRow][prevCol] = null;
  
        const newFEN = updateFEN(newBoard);
  
        setGameState(prevState => ({
          ...prevState,
          board: newBoard,
          selectedPiece: null,
          selectedPosition: null,
          validMoves: [],
          fen: newFEN, 
          moveHistory: [
            ...prevState.moveHistory, 
            { from: selectedPosition, to: [rowIndex, colIndex], piece: movedPiece, capturedPiece, capturedPosition: capturedPiece ? [rowIndex, colIndex] : null }
          ],
          turn: turn === 'r' ? 'b' : 'r' 
        }));
      }
    } else {
      // If no piece is selected and the clicked piece belongs to the current player, select it
      if (piece && piece[0] === turn) {
        const moves = getValidMoves(rowIndex, colIndex);
        setGameState(prevState => ({
          ...prevState,
          selectedPiece: piece,
          selectedPosition: [rowIndex, colIndex],
          validMoves: moves
        }));
      }
    }
  };
  

  const isMoveValid = (fromRow, fromCol, toRow, toCol) => {
    const { board } = gameState;
    const piece = board[fromRow][fromCol];
    const targetPiece = board[toRow][toCol];
  
    // Invalid move as piece is trying to capture its own piece
    if (targetPiece && piece[0] === targetPiece[0]) {
      return false; 
    }
  
    return pieceRules[piece]?.(fromRow, fromCol, toRow, toCol, board) ?? false;
  };

  const getValidMoves = (row, col) => {
    const piece = gameState.board[row][col];
    if (!piece) return [];

    let moves = [];
    for (let r = 0; r < gameState.board.length; r++) {
      for (let c = 0; c < gameState.board[r].length; c++) {
        if (isMoveValid(row, col, r, c)) {
          moves.push([r, c]);
        }
      }
    }
    return moves;
  };

  const undoMove = () => {
    if (gameState.moveHistory.length === 0) return;
  
    const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];
    const newBoard = gameState.board.map(row => row.slice());

    newBoard[lastMove.from[0]][lastMove.from[1]] = lastMove.piece;
    newBoard[lastMove.to[0]][lastMove.to[1]] = null;

    if (lastMove.capturedPiece && lastMove.capturedPosition) {
      newBoard[lastMove.capturedPosition[0]][lastMove.capturedPosition[1]] = lastMove.capturedPiece;
    }

    const newFEN = updateFEN(newBoard);
  
    setGameState(prevState => ({
      ...prevState,
      board: newBoard,
      fen: newFEN, 
      moveHistory: prevState.moveHistory.slice(0, -1), 
      turn: prevState.turn === 'r' ? 'b' : 'r' 
    }));
  };

  return (
    <>
    <div className="board-container">
      <div className="board">
        {gameState.board.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((piece, colIndex) => (
              <div
              className={`cell ${rowIndex === 4 || rowIndex === 5 ? 'river' : ''} ${gameState.validMoves.some(([r, c]) => r === rowIndex && c === colIndex) ? 'valid-move' : ''} ${gameState.selectedPiece && gameState.selectedPosition && gameState.selectedPosition[0] === rowIndex && gameState.selectedPosition[1] === colIndex ? 'selected' : ''}`}
              key={colIndex}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >            
                {piece && (
                  <div className={`piece ${piece}`}>
                 
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button className="undo-button" onClick={undoMove} disabled={gameState.moveHistory.length === 0}>Undo Move</button>
      <div className="move-history">
        <h3>Move History:</h3>
        <ul>
          {gameState.moveHistory.map((move, index) => (
            <li key={index}>
              {`Move ${index + 1}: ${move.piece} from (${move.from[0]}, ${move.from[1]}) to (${move.to[0]}, ${move.to[1]})`}
              {move.capturedPiece && `, captured ${move.capturedPiece} at (${move.capturedPosition[0]}, ${move.capturedPosition[1]})`}
            </li>
          ))}
        </ul>
      </div>
      <div className="turn-indicator">Current Turn: {gameState.turn === 'r' ? 'Red' : 'Black'}</div>
    </div>
    </>
  );
};

export default XiangqiBoard;
