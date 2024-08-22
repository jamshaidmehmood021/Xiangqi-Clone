import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';

import 'Components/BoardComponents/Square.scss';

const Square = React.memo(({ piece = '', size, rowIndex, colIndex, onMovePiece }) => {
    const squareSizeCalc = size.width / 10;

    const [{ isDragging }, drag] = useDrag({
        type: 'piece',
        item: { piece, rowIndex, colIndex },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'piece',
        drop: useCallback((item) => {
            if (item.rowIndex !== rowIndex || item.colIndex !== colIndex) {
                onMovePiece({ row: item.rowIndex, col: item.colIndex }, { row: rowIndex, col: colIndex });
            }
        }, [onMovePiece, rowIndex, colIndex]),
    });

    return (
        <div
            ref={node => drag(drop(node))}
            className={`square ${isDragging ? 'dragging' : ''}`}
            style={{ width: (size.width + squareSizeCalc) / 9, height: size.height / 9 }}
        >
            <div className={`${piece ? piece : ''}`} />
        </div>
    );
});

Square.propTypes = {
    piece: PropTypes.string,
    size: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
    }).isRequired,
    rowIndex: PropTypes.number.isRequired,
    colIndex: PropTypes.number.isRequired,
    onMovePiece: PropTypes.func.isRequired,
};

export default Square;
