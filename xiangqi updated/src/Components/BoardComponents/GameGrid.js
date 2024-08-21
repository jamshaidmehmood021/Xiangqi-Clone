import React from 'react';
import PropTypes from 'prop-types';

import Row from 'Components/BoardComponents/Row';

import "Components/BoardComponents/GameGrid.scss";

const GameGrid = (prop) => {
    const { board, size } = prop;
    return (
        <div className="game-grid">
            {board.map((row, rowIndex) => (
                <Row key={rowIndex} row={row} rowIndex={rowIndex} size={size} />
            ))}
        </div>
    );
};

GameGrid.propTypes = {
    board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    size: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
    }).isRequired,
};

export default GameGrid;
