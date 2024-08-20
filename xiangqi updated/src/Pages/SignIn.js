import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


import axiosInstance from "../lib/axios";
import Button from '../Components/PlainButton';
import Input from '../Components/Input';
import "./Home.scss";

const SignIn = () => {
    const navigate= useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
   

    const onSubmit = async (event) => {
        event.preventDefault();

        const newErrors = {};
        if (!username) newErrors.username = 'Email or Username is required';
        if (!password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await axiosInstance.post("/token/", { username, password });

            if (response.status === 200) {
                const { access, refresh } = response.data;
                const user = jwtDecode(access);
                localStorage.setItem('authTokens', JSON.stringify({ access, refresh }));
                localStorage.setItem('user', JSON.stringify(user.username));

                toast.success('Login successful!');
                navigate('/board'); 
            } else {
                toast.error('Login failed! Please check your credentials.');
            }
        } catch (e) {
            toast.error('An error occurred during login. Please try again.');
        }
    };

    return (
        <>
            <form onSubmit={onSubmit} className="space-y-4">
                <Input
                    id="username"
                    placeholder="Email or Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={errors.username}
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
        </>
    );
};

export default SignIn;
