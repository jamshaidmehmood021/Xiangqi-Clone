import React from 'react';
import GameGrid from 'Components/BoardComponents/GameGrid';
import 'Components/BoardComponents/BoardContainer.scss';

const BoardContainer = ({ size, board }) => {
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

export default BoardContainer;
