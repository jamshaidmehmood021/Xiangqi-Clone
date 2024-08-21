import React from 'react';
import Square from 'Components/BoardComponents/Square';
import "Components/BoardComponents/Row.scss";

const Row = ({ row, rowIndex, size }) => {
    return (
        <div key={rowIndex} className="row" style={{ height: size.height / 9 }}>
            {row.map((piece, colIndex) => (
                <Square key={colIndex} piece={piece} size={size} />
            ))}
        </div>
    );
};

export default Row;
