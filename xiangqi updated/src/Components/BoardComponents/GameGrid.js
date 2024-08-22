import React from 'react';
import PropTypes from 'prop-types';

import Row from 'Components/BoardComponents/Row';

import "Components/BoardComponents/GameGrid.scss";

const GameGrid = React.memo(({ board, size, onMovePiece }) => {
    return (
        <div className="game-grid">
            {board.map((row, rowIndex) => (
                <Row key={rowIndex} row={row} rowIndex={rowIndex} size={size} onMovePiece={onMovePiece} />
            ))}
        </div>
    );
});

GameGrid.propTypes = {
    board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    size: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
    }).isRequired,
    onMovePiece: PropTypes.func.isRequired,
};

export default GameGrid;
