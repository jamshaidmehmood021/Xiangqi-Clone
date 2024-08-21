import React, { useEffect, useState } from 'react';

import BoardContainer from 'Components/BoardComponents/BoardContainer';

import { parseFEN } from 'Utilities/parseFEN';

const Board = () => {
    const FEN = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR';
    const board = parseFEN(FEN);

    const [size, setSize] = useState({ width: 0, height: 0 });

    const calculateSizes = () => {
        const height = window.innerHeight * 0.8;
        const width = window.innerWidth * 0.8;
        
        const aspectRatio = 133 / 150;
        let calculateHeight = height;
        let calculatedWidth = calculateHeight * aspectRatio;

        if (height > width) {
            calculateHeight = width;
            calculatedWidth = calculateHeight * aspectRatio;
        }
        
        setSize({ width: calculatedWidth, height: calculateHeight });
    };

    useEffect(() => {
        calculateSizes();
        window.addEventListener('resize', calculateSizes);

        return () => {
            window.removeEventListener('resize', calculateSizes);
        };
    }, []);

    return (
        <div id='game-area'>
            <BoardContainer size={size} board={board} />
        </div>
    );
};

export default Board;
