import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

import { countryOptions, skillLevelOptions } from 'Components/options';
import CustomDropDown from 'Components/CustomDropDown';
import Button from 'Components/PlainButton';
import Input from 'Components/Input';

import axiosInstance from "lib/axios";

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    username: Yup.string()
        .required('Username is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    country: Yup.object().nullable()
        .required('Country is required'),
    skill: Yup.object().nullable()
        .required('Skill level is required')
});

const SignUp = () => { 
   
    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = async (data) => {
        try {
            const response = await axiosInstance.post('/register/', {
                email: data.email,
                username: data.username,
                password: data.password,
                country: data.country.value,
                skill: data.skill.value
            });

            if (response.status === 201) { 
                toast.success("Successfully signed up!");
            } else {
                toast.error(response.data?.message || "An error has occurred while signing up");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "An error has occurred while signing up");
        }
    };    

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
                name="email"
                control={control}
                render={({ field }) => (
                    <Input
                        id="email"
                        type="email"
                        placeholder="Email"
                        error={errors.email?.message}
                        {...field}
                    />
                )}
            />
            <Controller
                name="username"
                control={control}
                render={({ field }) => (
                    <Input
                        id="username"
                        type="text"
                        placeholder="Username"
                        error={errors.username?.message}
                        {...field}
                    />
                )}
            />
            <Controller
                name="password"
                control={control}
                render={({ field }) => (
                    <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        error={errors.password?.message}
                        {...field}
                    />
                )}
            />
            <div>
                <label htmlFor="country" className="block text-left text-sm text-gray-700">Country</label>
                <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                        <Select
                            id="country"
                            options={countryOptions}
                            className={`react-select-container input-background ${errors.country ? 'border-red-500' : ''}`}
                            classNamePrefix="react-select"
                            placeholder="Select your country"
                            components={{ Option: CustomDropDown }}
                            {...field}
                        />
                    )}
                />
                {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
            </div>
            <div>
                <label htmlFor="skillLevel" className="block text-left text-sm text-gray-700">Skill Level</label>
                <Controller
                    name="skill"
                    control={control}
                    render={({ field }) => (
                        <Select
                            id="skillLevel"
                            options={skillLevelOptions}
                            className={`react-select-container input-background ${errors.skill ? 'border-red-500' : ''}`}
                            classNamePrefix="react-select"
                            placeholder="Select your skill level"
                            components={{ Option: CustomDropDown }}
                            {...field}
                        />
                    )}
                />
                {errors.skill && <p className="text-red-500 text-sm">{errors.skill.message}</p>}
            </div>
            <Button type="submit">Sign Up</Button>
            <ToastContainer />
        </form>
    );    
};

export default SignUp;
