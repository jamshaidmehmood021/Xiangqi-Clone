import React from 'react';
import 'Components/BoardComponents/Square.scss';

const Square = ({ piece, size }) => {
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

export default Square;
