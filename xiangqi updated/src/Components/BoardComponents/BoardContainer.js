import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import GameGrid from 'Components/BoardComponents/GameGrid';

import 'Components/BoardComponents/BoardContainer.scss';

const BoardContainer = React.memo((prop) => {
    const { size, board: initialBoard, updateBoardState, turn, switchTurn } = prop;
    const [board, setBoard] = useState(initialBoard);

    const squareSizeCalc = size.width / 10;

    const movePiece = useCallback((fromPosition, toPosition) => {
        console.log('Moving piece from:', fromPosition, 'to:', toPosition);

        const piece = board[fromPosition.row][fromPosition.col];
        if (piece === '' || !piece.startsWith(turn.charAt(0))) {
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
        setBoard(newBoard);
        updateBoardState(newBoard);
        switchTurn();
    }, [board, turn, updateBoardState, switchTurn]);

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
            <GameGrid board={board} size={size} onMovePiece={movePiece} />
        </div>
    );
});

BoardContainer.propTypes = {
    size: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
    }).isRequired,
    board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    updateBoardState: PropTypes.func.isRequired,
    turn: PropTypes.string.isRequired,
    switchTurn: PropTypes.func.isRequired,
};

export default BoardContainer;
