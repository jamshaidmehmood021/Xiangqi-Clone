import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import GameGrid from 'Components/BoardComponents/GameGrid';

import { Xiangqi } from 'Utilities/xiangqi';
import { UCIToIndex } from 'Utilities/UCIToIndex';
import { indexToUCI } from "Utilities/IndexToUCI";
import { UCIMapping } from 'Utilities/UCIMapping';

import 'Components/BoardComponents/BoardContainer.scss';

const BoardContainer = React.memo((props) => {
    const game = new Xiangqi();
    

    const { FEN, setFEN, size, board: initialBoard, turn, switchTurn,handleGameOver } = props;
    //game.load(FEN);
    //handleGameOver(game); 

    const [board, setBoard] = useState(initialBoard);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [availableMoves, setAvailableMoves] = useState([]);

    const squareSizeCalc = size.width / 10;

    const movePiece = useCallback((fromPosition, toPosition) => {
        if (fromPosition.row === toPosition.row && fromPosition.col === toPosition.col) {
            return;
        }
        const piece = board[fromPosition.row][fromPosition.col];
        if (piece === '' || !piece.startsWith(turn.charAt(0))) {
            return;
        }
        const targetPiece = board[toPosition.row][toPosition.col];
        if (targetPiece && targetPiece.startsWith(turn.charAt(0))) {
            return;
        }
        
        const newBoard = board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
                if (rowIndex === fromPosition.row && colIndex === fromPosition.col) {
                    return ''; 
                } else if (rowIndex === toPosition.row && colIndex === toPosition.col) {
                    return board[fromPosition.row][fromPosition.col];
                } else {
                    return piece;
                }
            })
        );
    
        const UCIMove = UCIMapping[fromPosition.row][fromPosition.col] + UCIMapping[toPosition.row][toPosition.col];
        
        game.load(FEN);
        game.move(UCIMove);
        const newFEN = game.fen();
        setFEN(newFEN);
    
        setBoard(newBoard);
        switchTurn();
        setSelectedPiece(null);
        setAvailableMoves([]);
        handleGameOver(game)
    }, [board, turn, switchTurn, FEN]);
    

    const handleSquareClick = useCallback((position) => {
        if (!position) {
            setSelectedPiece(null);
            setAvailableMoves([]);
            return;
        }
    
        const piece = board[position.row][position.col];
    
        if (piece && piece.startsWith(turn.charAt(0))) {
            if (selectedPiece) {
                if (availableMoves.some(move => move.row === position.row && move.col === position.col)) {
                    movePiece(selectedPiece, position);
                }
                setSelectedPiece(null);
                setAvailableMoves([]);
            } else {
                const pieceUCI = indexToUCI(position);    
                game.load(FEN);
                const moves = game.moves();
                const filteredMoves = moves.filter(move => move.startsWith(pieceUCI));
                const targetPositions = filteredMoves.map(move => UCIToIndex(move.slice(2)));
    
                setSelectedPiece(position);
                setAvailableMoves(targetPositions);
            }
        } else if (selectedPiece) {
            if (availableMoves.some(move => move.row === position.row && move.col === position.col)) {
                movePiece(selectedPiece, position);
            }
            setSelectedPiece(null);
            setAvailableMoves([]);
        } else {
            console.log("Not the correct turn for this piece color or no piece selected.");
        }
    }, [FEN, movePiece, selectedPiece, board, turn, availableMoves]);
    
    return (
        <div
            className="board-container"
            style={{
                width: size.width + squareSizeCalc,
                height: size.height + squareSizeCalc,
                backgroundSize: `${size.width}px ${size.height}px`,
                backgroundPosition: `${squareSizeCalc / 2}px ${squareSizeCalc / 2}px`,
            }}
        >
            <GameGrid 
                FEN={FEN}
                board={board} 
                size={size} 
                onMovePiece={movePiece} 
                selectedPiece={selectedPiece} 
                availableMoves={availableMoves}
                onSquareClick={handleSquareClick} 
            />
        </div>
    );
});

BoardContainer.propTypes = {
    size: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
    }).isRequired,
    board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    turn: PropTypes.string.isRequired,
    switchTurn: PropTypes.func.isRequired,
    FEN: PropTypes.string.isRequired,
    setFEN: PropTypes.func.isRequired,
};

export default BoardContainer;
