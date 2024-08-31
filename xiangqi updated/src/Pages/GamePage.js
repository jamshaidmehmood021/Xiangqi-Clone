import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from 'lib/axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthContext } from 'Context/authContext';  

const GamePage = () => {
    const [games, setGames] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);  

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await axiosInstance.get('/games/');
                const games = response.data;
                setGames(response.data);
            } catch (e) {
                toast.error('An error occurred while fetching games.');
            }
        };

        fetchGames();
    }, []);

    const handlePlay = async (gameId) => {
        try {
            await axiosInstance.put(`/games/${gameId}/update/`, { player2: user });
            navigate(`/board/${gameId}`);
        } catch (e) {
            console.error('Error joining game:', e);
        }
    };


    const handleDeleteClick = async (gameId) => {
        try {
            const response = await axiosInstance.delete(`/games/${gameId}/delete/`);
    
            if (response.status === 204) {
                toast.success('Game deleted successfully!');
                setGames(games.filter(game => game.id !== gameId));
            } else {
                toast.error('Failed to delete game.');
            }
        } catch (e) {
            toast.error('An error occurred while deleting the game.');
        }
    };
    

    return (
       
        <>
                <h1 className="text-2xl font-bold mb-4">Available Games</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games.map(game => (
                        <div key={game.id} className="bg-white p-4 rounded shadow-lg border border-gray-200">
                            <h2 className="text-xl font-bold mb-2">Game ID: {game.id}</h2>
                            <p><strong>Player 1:</strong> {game.player1}</p>
                            <p><strong>Player 2:</strong> {game.player2 || 'Waiting for opponent...'}</p>
                            <p><strong>FEN:</strong> {game.fen}</p>
                            <p><strong>Moves:</strong> {game.moves}</p>
                            <div className="mt-4 flex space-x-2">
                                <button
                                    onClick={() => handlePlay(game.id)}
                                    className={`flex-1 px-4 py-2 rounded font-semibold transition-colors ${
                                        game.player2 ? 'bg-gray-400 text-gray-800 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                                    disabled={game.player2}
                                >
                                    {game.player2 ? 'Game Full' : 'Play'}
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(game.id)}
                                    className="flex-1 px-4 py-2 rounded font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            {error && <p className="text-red-500">{error}</p>}
            <ToastContainer />
        </>
    );
};

export default GamePage;
