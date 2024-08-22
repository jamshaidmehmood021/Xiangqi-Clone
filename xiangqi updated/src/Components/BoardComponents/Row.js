import React from 'react';
import PropTypes from 'prop-types';

import Square from 'Components/BoardComponents/Square';

import "Components/BoardComponents/Row.scss";

const Row = React.memo((prop) => {
    const { row, rowIndex, size, onMovePiece } = prop;
    return (
        <div className="row" style={{ height: size.height / 9 }}>
            {row.map((piece, colIndex) => (
                <Square 
                    key={colIndex} 
                    piece={piece} 
                    size={size} 
                    rowIndex={rowIndex} 
                    colIndex={colIndex} 
                    onMovePiece={onMovePiece} 
                />
            ))}
        </div>
    );
});

Row.propTypes = {
    row: PropTypes.arrayOf(PropTypes.string).isRequired,
    rowIndex: PropTypes.number.isRequired,
    size: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
    }).isRequired,
    onMovePiece: PropTypes.func.isRequired,
};

export default Row;
