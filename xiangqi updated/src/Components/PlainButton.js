import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ type = 'button', className= "", onClick= ()=>{}, children }) => (
    <button
        type={type}
        className={`w-full text-white py-2 rounded-md bg-red-700 ${className}`}
        onClick={onClick}
    >
        {children}
    </button>
);

Button.propTypes = {
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    className: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.node.isRequired,
};
export default Button;
