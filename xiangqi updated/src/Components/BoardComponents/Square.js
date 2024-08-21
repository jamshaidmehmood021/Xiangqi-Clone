import React from 'react';
import PropTypes from 'prop-types';

import 'Components/BoardComponents/Square.scss';

const Square = (prop) => {
    const { piece, size } = prop;
    const squareSizeCalc = size.width / 10;

    return (
        <div
            className="square"
            style={{ width: (size.width + squareSizeCalc) / 9 }}
        >
            <div className={`${piece ? piece : ''}`} />
        </div>
    );
};

Square.propTypes = {
    piece: PropTypes.string,
    size: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
    }).isRequired,
};

Square.defaultProps = {
    piece: '',
};

export default Square;
