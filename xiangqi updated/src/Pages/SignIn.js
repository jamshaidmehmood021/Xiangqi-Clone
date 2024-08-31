import React, { useState, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'lib/axios';
import Button from 'Components/PlainButton';
import Input from 'Components/Input';
import { AuthContext } from 'Context/authContext';
import 'react-toastify/dist/ReactToastify.css';

import { jwtDecode } from 'jwt-decode';


const SignIn = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});


    const onSubmit = async (event) => {
        event.preventDefault();
        const newErrors = {};
        if (!usernameOrEmail) newErrors.usernameOrEmail = 'Email or Username is required';
        if (!password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await axiosInstance.post('/login/', { username_or_email: usernameOrEmail, password });
            if (response.status === 200) {
                const { access, refresh } = response.data;
                const decodedToken = jwtDecode(access); 
                const user = decodedToken.user_id; 
                login(access, refresh);
                toast.success('Login successful!');

                await checkOrCreateOrUpdateGame(user); 
            } else {
                toast.error('Login failed! Please check your credentials.');
            }
        } catch (e) {
            toast.error('An error occurred during login. Please try again.');
        }
    };

    const checkOrCreateOrUpdateGame = async (username) => {
        try {
            const response = await axiosInstance.get('/games/');
            const games = response.data;
            const availableGame = games.find(game =>
                game.player1 !== username && game.player2 !== username
            );

            if (availableGame) {
                navigate('/game', { state: { games } });
            } else {
                const newGameResponse = await axiosInstance.post('/game/', { player1: username });
                const { id } = newGameResponse.data;
                toast.success('New game created successfully!');
                navigate(`/board/${id}`);  
            }
        } catch (e) {
            toast.error('An error occurred while checking or creating/updating a game.');
        }
    };

    return (
        <div>
            <form onSubmit={onSubmit} className="space-y-4">
                <Input
                    id="usernameOrEmail"
                    placeholder="Email or Username"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    error={errors.usernameOrEmail}
                />
                <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                />
                <a href="/" className="block text-right text-sm text-gray-500 text-1xl hover:underline">Forgot password?</a>
                <Button type="submit">Sign In</Button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default SignIn;
