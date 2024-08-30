import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import GameGrid from 'Components/BoardComponents/GameGrid';
import Animation from 'Components/Animations/Animation'; 
import { CHECKMATE } from 'Components/Animations/constants/constants';

import { Xiangqi } from 'Utilities/xiangqi';
import { UCIToIndex } from 'Utilities/UCIToIndex';
import { indexToUCI } from 'Utilities/IndexToUCI';
import { UCIMapping } from 'Utilities/UCIMapping';
 
import 'Components/BoardComponents/BoardContainer.scss';

const BoardContainer = React.memo((props) => {
    const { FEN, setFEN, size, board: initialBoard, turn, switchTurn, handleGameOver } = props;
    const game = new Xiangqi();
    const [board, setBoard] = useState(initialBoard);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [availableMoves, setAvailableMoves] = useState([]);
    const [animation, setAnimation] = useState(null); 
    const [animationPosition, setAnimationPosition] = useState({ row: 0, col: 0 }); 

    useEffect(() => {
        game.load(FEN);
        const currentTurn = game.turn(); 
        if (turn !== currentTurn) {
            switchTurn(); 
        }
    }, [FEN, turn, switchTurn, game]);

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
        
        if (game.in_checkmate()) {
            setAnimation(CHECKMATE);

            let opponentKing = turn === 'r' ? 'b_general' : 'r_general'; 
            let kingPosition = { row: 0, col: 0 };
    
            
            for (let row = 0; row < board.length; row++) {
                for (let col = 0; col < board[row].length; col++) {
                    if (board[row][col] === opponentKing) {
                        kingPosition = { row, col };
                        break;
                    }
                }
            }
    
            setAnimationPosition(kingPosition); 
        }
    }, [board, turn, switchTurn, FEN, game, handleGameOver, setFEN]);

    console.log(size)
    
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
            {animation && (
             <Animation
                 type={animation}
                 options={{ loop: false, autoplay: true }}
                 width={size * 2} 
                 height={size * 2} 
                 customStyle={{
                position: 'absolute',
                top: animationPosition.row * size - (size * 0.5), 
                left: animationPosition.col * size - (size * 0.5),
                zIndex: 10,
             }}
            />
            )}
        </div>
    );
});

BoardContainer.propTypes = {
    FEN: PropTypes.string.isRequired,
    setFEN: PropTypes.func.isRequired,
    size: PropTypes.number.isRequired,
    board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    turn: PropTypes.string.isRequired,
    switchTurn: PropTypes.func.isRequired,
    handleGameOver: PropTypes.func.isRequired,
};

export default BoardContainer;
