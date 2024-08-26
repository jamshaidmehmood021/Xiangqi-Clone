import React, { useEffect, useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BoardContainer from 'Components/BoardComponents/BoardContainer';
import { parseFEN } from 'Utilities/parseFEN';
import MessageModal from 'Components/MessageModal'; 
import { START_FEN } from 'Utilities/startFen';
import "Pages/Board.scss";

const Board = () => {
    const [FEN, setFEN] = useState(START_FEN);
    const { board, turn: initialTurn } = parseFEN(FEN); 
    const [boardState, setBoardState] = useState(board);
    const [turn, setTurn] = useState(initialTurn);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const [gameOver, setGameOver] = useState(false); 
    const [gameResult, setGameResult] = useState(''); 

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
        setSize({ width: Math.round(calculatedWidth), height: Math.round( calculatedHeight)});
    }, []);

    useEffect(() => {
        calculateSizes();
        window.addEventListener('resize', calculateSizes);

        return () => {
            window.removeEventListener('resize', calculateSizes);
        };
    }, [calculateSizes]);

    const switchTurn = useCallback(() => {
        setTurn(prevTurn => (prevTurn === 'r' ? 'b' : 'r'));
    }, []);

   
    const handleGameOver = useCallback((xiangqi) => {
        if (xiangqi.game_over()) {
            setGameOver(true);
            if (xiangqi.in_checkmate()) {
                setGameResult(`Checkmate! ${turn === 'r' ? 'Black' : 'Red'} wins.`);
            } else if (xiangqi.in_stalemate()) {
                setGameResult('Stalemate! The game is a draw.');
            } else if (xiangqi.in_draw()) {
                setGameResult('Draw! The game ended in a draw.');
            }
        }
    }, [turn]);

    return (
        <DndProvider backend={HTML5Backend}>
            <div id='game-area'>
                <BoardContainer
                    FEN={FEN}
                    setFEN={setFEN}
                    size={size}
                    board={boardState}
                    turn={turn}
                    switchTurn={switchTurn}
                    handleGameOver={handleGameOver}
                />
                <div className="turn-indicator">
                    <p>Current Turn: {turn}</p>
                </div>
                
                <MessageModal
                    isOpen={gameOver}
                    title="Game Over"
                    message={gameResult}
                    onClose={() => setGameOver(false)}
                />
            </div>
        </DndProvider>
    );
};

export default Board;
