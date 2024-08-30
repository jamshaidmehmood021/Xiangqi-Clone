import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import BoardContainer from 'Components/BoardComponents/BoardContainer';
import MessageModal from 'Components/MessageModal';
import Animation from 'Components/Animations/Animation';

import { parseFEN } from 'Utilities/parseFEN';
import { START_FEN } from 'Utilities/startFen';
import "Pages/Board.scss";

const Board = () => {
    const { game_id } = useParams(); 
    const [FEN, setFEN] = useState(START_FEN);
    const { board } = parseFEN(FEN);
    const [boardState, setBoardState] = useState(board);
    const [turn, setTurn] = useState(parseFEN(FEN).turn); 
    const [size, setSize] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameResult, setGameResult] = useState('');
    const [ws, setWs] = useState(null);
    const [animationType, setAnimationType] = useState(''); 

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

    useEffect(() => {
        if (!game_id) return;

        const websocket = new WebSocket(`ws://localhost:8001/ws/game/${game_id}/`);
        
        websocket.onopen = () => console.log('WebSocket connection established.');
        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'move') {
                setBoardState(data.boardUpdate);
                setFEN(data.FEN);
                setTurn(data.turn); 
            }
        };
        websocket.onclose = () => console.log('WebSocket connection closed.');
        setWs(websocket);

        return () => {
            websocket.close();
        };
    }, [game_id]);

    const handleGameOver = useCallback((xiangqi) => {
        if (xiangqi.game_over()) {
            setGameOver(true);
            let resultMessage = '';
            let animationType = ''; 
    
            if (xiangqi.in_checkmate()) {
                resultMessage = `Checkmate! ${turn === 'r' ? 'Black' : 'Red'} wins.`;
                animationType = 'checkmate'; 
            } else if (xiangqi.in_stalemate()) {
                resultMessage = 'Stalemate! The game is a draw.';
                animationType = 'stalemate'; 
            } else if (xiangqi.in_draw()) {
                resultMessage = 'Draw! The game ended in a draw.';
                animationType = 'draw'; 
            }
    
            setGameResult(resultMessage);
            setAnimationType(animationType); 
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
                    ws={ws}
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

                {gameOver && animationType && (
                <Animation
                    type={animationType}
                    options={{}}
                    width={`${size * 9}px`} 
                    height={`${size * 10}px`}
                    customStyle={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                />
                )}
            </div>
        </DndProvider>
    );
};

export default Board;
