import React, { useState, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import axiosInstance from 'lib/axios';

import Button from 'Components/PlainButton';
import Input from 'Components/Input';

import { AuthContext } from 'Context/authContext';

const SignIn = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const createGame = async (accessToken, username) => {
        try {
            const response = await fetch('http://localhost:8000/api/create-game/', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`, 
                },
                body: JSON.stringify({ username })
            });

            if (response.ok) {
                const data = await response.json();
                navigate(`/board/${data.id}`); 
            } else {
                console.error('Failed to create game:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating game:', error);
        }
    };

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
                const { access, refresh, username } = response.data;
                login(access, refresh, username);
                toast.success('Login successful!');
                await createGame(access, username);  
            } else {
                toast.error('Login failed! Please check your credentials.');
            }
        } catch (e) {
            toast.error('An error occurred during login. Please try again.');
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
