import React, { useEffect, useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import BoardContainer from 'Components/BoardComponents/BoardContainer';
import { parseFEN } from 'Utilities/parseFEN';
import { generateFENFromBoard } from 'Utilities/generateFENFromBoard';

const Board = () => {
    const [FEN, setFEN] = useState('rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR');
    const [board, setBoard] = useState(parseFEN(FEN));

    const [size, setSize] = useState({ width: 0, height: 0 });

    const calculateSizes = useCallback(() => {
        const height = window.innerHeight * 0.8;
        const width = window.innerWidth * 0.8;
        
        const aspectRatio = 133 / 150;
        let calculatedHeight = height;
        let calculatedWidth = calculatedHeight * aspectRatio;

        if (height > width) {
            calculatedHeight = width;
            calculatedWidth = calculatedHeight * aspectRatio;
        }
        
        setSize({ width: calculatedWidth, height: calculatedHeight });
    }, []);

    useEffect(() => {
        calculateSizes();
        window.addEventListener('resize', calculateSizes);

        return () => {
            window.removeEventListener('resize', calculateSizes);
        };
    }, [calculateSizes]);

    const updateBoardState = useCallback((newBoard) => {
        setBoard(newBoard);
        const newFEN = generateFENFromBoard(newBoard);
        setFEN(newFEN);
    }, []);

    return (
        <DndProvider backend={HTML5Backend}>
            <div id='game-area'>
                <BoardContainer size={size} board={board} updateBoardState={updateBoardState} />
            </div>
        </DndProvider>
    );
};

export default Board;
