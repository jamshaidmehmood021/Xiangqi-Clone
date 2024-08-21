import React, { useState, Suspense } from 'react';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';

import Button from 'Components/CustomButton';

import { LazySignIn, LazySignUp } from 'LazyComponent/LazyLoading';

const Home = () => {
    const navigate = useNavigate();
    const [isSignIn, setIsSignIn] = useState(true);

    const handelSignInClick = () => {
        setIsSignIn(true);
        navigate('/auth/signIn');
    };
    
    const handelSignUpClick = () => {
        setIsSignIn(false);
        navigate('/auth/signUp');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
            <div className="sm:p-10 bg-opacity-90 p-8 rounded-lg shadow-lg w-96" style={{backgroundColor: 'rgb(255, 251, 242)', width : '432px'}}>
                <div className="flex items-center justify-center mb-6">
                    <img 
                        src="https://d2g1zxtf4l76di.cloudfront.net/images/new-ui/logo-icon.svg" 
                        alt="Logo Icon" 
                        className="w-8 h-8 mr-2" 
                    />
                    <img 
                        src="https://d2g1zxtf4l76di.cloudfront.net/images/new-ui/xiangqi-text-red.svg" 
                        alt="Logo Text" 
                        className="h-8" 
                    />
                </div>
                <div className="flex justify-center mb-6">
                    <Button 
                        label="Sign In" 
                        onClick={handelSignInClick} 
                        className={`font-bold tab ${isSignIn ? 'selected-tab' : ''}`}
                        style={{ padding: '10px 20px', fontWeight: isSignIn ? 'bold' : 'normal' }}
                    />
                    <Button 
                        label="Sign Up" 
                        onClick={handelSignUpClick} 
                        className={`font-bold tab ${!isSignIn ? 'selected-tab' : ''}`}
                        style={{ padding: '10px 20px', fontWeight: !isSignIn ? 'bold' : 'normal' }}
                    />
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    {isSignIn ? <LazySignIn /> : <LazySignUp/>}
                </Suspense>
                <p className="text-center text-gray-600 my-4 font-bold" style={{color:'rgba(156,13,5)'}}>Play as Guest</p>
                <div className="flex justify-center space-x-4">
                    <Button 
                        icon={faGoogle} 
                        className="hover:bg-gray-400"
                        iconClassName="text-red-600"
                    />
                    <Button 
                        icon={faFacebookF} 
                        className="hover:bg-gray-400"
                        iconClassName="text-blue-600"
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
