import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';

import BoardContainer from 'Components/BoardComponents/BoardContainer';
import MessageModal from 'Components/MessageModal';

import { parseFEN } from 'Utilities/parseFEN';
import { START_FEN } from 'Utilities/startFen';

import "Pages/Board.scss";

const Board = () => {
    const navigate = useNavigate();
    const { game_id } = useParams(); 
    const [FEN, setFEN] = useState(START_FEN);
    const { board } = parseFEN(FEN);
    const [boardState, setBoardState] = useState(board);
    const [turn, setTurn] = useState(parseFEN(FEN).turn); 
    const [size, setSize] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameResult, setGameResult] = useState('');


    const switchTurn = useCallback(() => {
        setTurn(prevTurn => (prevTurn === 'r' ? 'b' : 'r'));
    }, []);

    const calculateSizes = useCallback(() => {
        let width, height;
    
        if (window.innerWidth <= 768) {
            height = window.innerHeight * 1;
            width = window.innerWidth * 1;
        } else {
            height = window.innerHeight * 0.8;
            width = window.innerWidth * 0.8;
        }
    
        const squareSize = width < height ? width / 10 : height / 10;
        setSize(Math.round(squareSize));
    }, []);

    useEffect(() => {
        calculateSizes();
        window.addEventListener('resize', calculateSizes);

        return () => {
            window.removeEventListener('resize', calculateSizes);
        };
    }, [calculateSizes]);

    const handleGameOver = useCallback((xiangqi) => {
        if (xiangqi.game_over()) {
            setGameOver(true);
            let resultMessage = '';
    
            if (xiangqi.in_checkmate()) {
                resultMessage = `Checkmate! ${turn === 'r' ? 'Red' : 'Black'} wins.`;
               
            } else if (xiangqi.in_stalemate()) {
                resultMessage = 'Stalemate! The game is a draw.';
               
            } else if (xiangqi.in_draw()) {
                resultMessage = 'Draw! The game ended in a draw.';
        
            }
    
            setGameResult(resultMessage);
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
                    gameId={game_id}
                />
                <div className="turn-indicator">
                    <p>Current Turn: {turn === 'r' ? 'Red' : 'Black'}</p>
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
