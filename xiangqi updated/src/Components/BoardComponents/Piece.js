import React from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import 'Components/BoardComponents/Piece.scss';

const Piece = ({ piece, rowIndex, colIndex, onSquareClick, onDragStart, isSelected, onPieceClick, availableMoves }) => {
    const canDrag = piece !== '';

    const [{ isDragging }, drag, preview] = useDrag({
        type: 'piece',
        item: () => {
            onDragStart({ row: rowIndex, col: colIndex });
            return { piece, rowIndex, colIndex };
        },
        canDrag: () => canDrag,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    preview(null);

    const handleClick = () => {
        onPieceClick();
        onSquareClick({ row: rowIndex, col: colIndex });
    };

    return (
        <div
            ref={drag}
            className={`piece ${piece} ${isDragging ? 'dragging' : ''} ${isSelected ? 'selected' : ''}`}
            onClick={handleClick}
        >
        </div>
    );
};

Piece.propTypes = {
    piece: PropTypes.string.isRequired,
    rowIndex: PropTypes.number.isRequired,
    colIndex: PropTypes.number.isRequired,
    onSquareClick: PropTypes.func.isRequired,
    onDragStart: PropTypes.func.isRequired,
    isSelected: PropTypes.bool,
    onPieceClick: PropTypes.func.isRequired,
};

export default Piece;
