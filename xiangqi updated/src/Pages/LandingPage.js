import React from 'react';
import 'Pages/LandingPage.scss';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex h-screen">
            <div className="fixed-left-div">
                <Link to="/profile">
                    <div className="profile-button-container">
                        <button className="profile-button">
                            <span className="profile-icon">👤</span>
                        </button>
                    </div>
                </Link>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center h-screen text-center welcome-head">
                    <div className='mb-8 welcome-text'>
                        <h3>
                            <span className='font-bold text-red-700'>Welcome to</span>
                            <div className="xqdotcom font-bold" >
                                <span>Xiangqi.com!</span>
                            </div>
                        </h3>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white border-2 border-red-700 text-left px-6 py-4 rounded-lg shadow-lg w-80">
                            <Link to="/auth" >
                                <div className="flex items-center">
                                    <span className="text-red-700 text-xl mr-3">🎮</span>
                                    <div>
                                        <h2 className="text-xl font-bold text-red-700">Play Game</h2>
                                        <p className="text-gray-600">Challenge Players Worldwide</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="bg-white border-2 border-red-700 text-left px-6 py-4 rounded-lg shadow-lg w-80">
                            <Link to="/chat">
                                <div className="flex items-center">
                                    <span className="text-red-700 text-xl mr-3">💬</span>
                                    <div>
                                        <h2 className="text-xl font-bold text-red-700">Chat</h2>
                                        <p className="text-gray-600">Connect with Other Players</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
