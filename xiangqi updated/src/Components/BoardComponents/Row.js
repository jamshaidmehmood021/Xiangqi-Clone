import React from 'react';
import PropTypes from 'prop-types';

import Square from 'Components/BoardComponents/Square';

import "Components/BoardComponents/Row.scss";

const Row = (prop) => {
    const { row, rowIndex, size } = prop;
    return (
        <div key={rowIndex} className="row" style={{ height: size.height / 9 }}>
            {row.map((piece, colIndex) => (
                <Square key={colIndex} piece={piece} size={size} />
            ))}
        </div>
    );
};

Row.propTypes = {
    row: PropTypes.arrayOf(PropTypes.string).isRequired,
    rowIndex: PropTypes.number.isRequired,
    size: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
    }).isRequired,
};

export default Row;
