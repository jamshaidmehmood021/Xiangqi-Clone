import React from 'react';
import PropTypes from 'prop-types';

import GameGrid from 'Components/BoardComponents/GameGrid';

import 'Components/BoardComponents/BoardContainer.scss';

const BoardContainer = (prop) => {
    const { size, board } = prop;
    const squareSizeCalc = size.width / 10;

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
            <GameGrid board={board} size={size} />
        </div>
    );
};

BoardContainer.propTypes = {
    size: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
    }).isRequired,
    board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};

export default BoardContainer;
