import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Button = ({ label, icon, onClick, className, style, type, iconClassName }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`flex items-center justify-center font-bold ${className}`}
            style={style}
        >
            {icon && <FontAwesomeIcon icon={icon} className={`mr-2 ${iconClassName}`} />}
            {label && <span>{label}</span>}
        </button>
    );
};

Button.propTypes = {
    label: PropTypes.string,
    icon: PropTypes.object,
    onClick: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    iconClassName: PropTypes.string,
};

Button.defaultProps = {
    type: 'button',
    className: 'w-12 h-12',
    iconClassName: 'text-xl',
};

export default Button;
