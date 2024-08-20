import React from 'react';

import './LandingPage.scss';

const Home = () => {
    return (
        <div className="flex h-screen">
            <div className="fixed-left-div">
            </div>

            <div className="flex-grow flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center h-screen text-center welcome-head">
                    <h3>
                        <span>Welcome to</span>
                        <div className="xqdotcom">
                            <span>Xiangqi.com!</span>
                        </div>
                    </h3>
                    <div className="space-y-6">
                        <div className="bg-white border-2 border-red-700 text-left px-6 py-4 rounded-lg shadow-lg w-80">
                            <div className="flex items-center">
                                <span className="text-red-700 text-xl mr-3">🎮</span>
                                <div>
                                    <h2 className="text-xl font-bold text-red-700">Play Online</h2>
                                    <p className="text-gray-600">Challenge Players Worldwide</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white border-2 border-red-700 text-left px-6 py-4 rounded-lg shadow-lg w-80">
                            <div className="flex items-center">
                                <span className="text-red-700 text-xl mr-3">🤖</span>
                                <div>
                                    <h2 className="text-xl font-bold text-red-700">Play Computer</h2>
                                    <p className="text-gray-600">Test Your Skills Against AI</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white border-2 border-red-700 text-left px-6 py-4 rounded-lg shadow-lg w-80">
                            <div className="flex items-center">
                                <span className="text-red-700 text-xl mr-3">💬</span>
                                <div>
                                    <h2 className="text-xl font-bold text-red-700">Chat</h2>
                                    <p className="text-gray-600">Connect with Other Players</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
