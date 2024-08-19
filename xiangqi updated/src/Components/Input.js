import React from 'react';

const Input = ({ id, type = 'text', placeholder, error, ...rest }) => (
    <div>
        <input
            type={type}
            id={id}
            placeholder={placeholder}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 input-background ${error ? 'border-red-500' : ''}`}
            {...rest}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
);

export default Input;
