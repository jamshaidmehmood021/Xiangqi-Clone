import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import GameGrid from 'Components/BoardComponents/GameGrid';
import { Xiangqi } from 'Utilities/xiangqi';
import { UCIToIndex } from 'Utilities/UCIToIndex';
import { indexToUCI } from 'Utilities/IndexToUCI';
import { UCIMapping } from 'Utilities/UCIMapping';
import 'Components/BoardComponents/BoardContainer.scss';

const BoardContainer = React.memo((props) => {
    const { FEN, setFEN, size, board: initialBoard, turn, switchTurn, handleGameOver, ws } = props;
    const game = new Xiangqi();
    const [board, setBoard] = useState(initialBoard);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [availableMoves, setAvailableMoves] = useState([]);

    useEffect(() => {
        game.load(FEN);
        const currentTurn = game.turn(); // Get the turn from the FEN
        if (turn !== currentTurn) {
            switchTurn(); // Adjust turn if necessary
        }
    }, [FEN, turn, switchTurn, game]);

    useEffect(() => {
        if (!ws) return;

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'move') {
                setBoard(data.boardUpdate);
                setFEN(data.FEN);
                setAvailableMoves([]); // Clear moves after update
                setSelectedPiece(null); // Deselect piece after update
                if (data.turn) {
                    switchTurn(); // Update turn from WebSocket message
                }
            }
        };

        return () => {
            ws.onmessage = null;
        };
    }, [ws, setFEN, switchTurn]);

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
        setSelectedPiece(null);
        setAvailableMoves([]);
        handleGameOver(game);
    
        if (ws) {
            const data = {
                type: 'move',
                from: fromPosition,
                to: toPosition,
                FEN: newFEN,
                boardUpdate: newBoard,
                turn: turn === 'r' ? 'b' : 'r' // Send updated turn
            };
            ws.send(JSON.stringify(data));
        }
    }, [board, turn, switchTurn, FEN, ws, game, handleGameOver, setFEN]);

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
    }, [FEN, movePiece, selectedPiece, board, turn, availableMoves, game]);

    const showPieceMoves = (row, col) => {
        const position = { row, col };
        const pieceUCI = indexToUCI(position);    
        game.load(FEN);
        const moves = game.moves();
        const filteredMoves = moves.filter(move => move.startsWith(pieceUCI));
        return filteredMoves.map(move => UCIToIndex(move.slice(2)));
    };

    const handleDragStart = (position) => {
        const moves = showPieceMoves(position.row, position.col);
        setAvailableMoves(moves);
    };

    return (
        <div
            className="board-container"
            style={{
                width: size * 9,
                height: size * 10,
                backgroundSize: `${((size * 9) - size)}px ${((size * 10) - size)}px`,
                backgroundPosition: `${size / 2}px ${size / 2}px`,
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
                onDragStart={handleDragStart}
            />
        </div>
    );
});

BoardContainer.propTypes = {
    size: PropTypes.number.isRequired,
    board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    turn: PropTypes.string.isRequired,
    switchTurn: PropTypes.func.isRequired,
    FEN: PropTypes.string.isRequired,
    setFEN: PropTypes.func.isRequired,
    gameId: PropTypes.number,
    ws: PropTypes.object,
};

export default BoardContainer;
    