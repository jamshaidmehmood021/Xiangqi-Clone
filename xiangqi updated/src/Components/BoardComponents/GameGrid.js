import React from 'react';
import Row from 'Components/BoardComponents/Row';
import "Components/BoardComponents/GameGrid.scss";

const GameGrid = ({ board, size }) => {
    return (
        <div className="game-grid">
            {board.map((row, rowIndex) => (
                <Row key={rowIndex} row={row} rowIndex={rowIndex} size={size} />
            ))}
        </div>
    );
};

export default GameGrid;
