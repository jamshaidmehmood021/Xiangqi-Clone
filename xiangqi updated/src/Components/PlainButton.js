import React from 'react';

const Button = ({ type = 'button', className, onClick, children }) => (
    <button
        type={type}
        className={`w-full text-white py-2 rounded-md bg-red-700 ${className}`}
        onClick={onClick}
    >
        {children}
    </button>
);

export default Button;
