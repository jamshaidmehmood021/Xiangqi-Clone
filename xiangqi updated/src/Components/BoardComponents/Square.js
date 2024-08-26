import React from 'react';
import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';
import 'Components/BoardComponents/Square.scss';

const Square = ({
    piece = '',
    size,
    rowIndex,
    colIndex,
    onMovePiece,
    isSelected,
    selectedPiece,
    onSquareClick,
    isHighlight,
    availableMoves
}) => {
    const squareSizeCalc = size.width / 10;
    const canDrag = piece !== '' && availableMoves.length > 0;

    const [{ isDragging }, drag, preview] = useDrag({
        type: 'piece',
        item: { piece, rowIndex, colIndex },
        canDrag: () => canDrag,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'piece',
        canDrop: (item) => {
            // Check if the target square is a valid move for the piece
            return availableMoves.some(move => move.row === rowIndex && move.col === colIndex);
        },
        drop: (item) => {
            // Perform the move if the drop is valid
            if (item.rowIndex !== rowIndex || item.colIndex !== colIndex) {
                onMovePiece({ row: item.rowIndex, col: item.colIndex }, { row: rowIndex, col: colIndex });
            }
        },
    });

    preview(null);

    const handleDragStart = () => {
        onSquareClick({ row: rowIndex, col: colIndex });
    };

    const handleDragEnd = () => {
        if (selectedPiece) {
            onSquareClick(null);
        }
    };

    const handleClick = () => {
        onSquareClick({ row: rowIndex, col: colIndex });
    };

    const ref = React.useRef(null);
    drag(drop(ref));

    return (
        <div
            ref={ref}
            className={`square ${isDragging ? 'dragging' : ''} ${isHighlight ? 'highlight' : ''} ${isSelected ? 'selected' : ''}`}
            style={{ width: (size.width + squareSizeCalc) / 9, height: size.height / 9 }}
            onClick={handleClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
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
    rowIndex: PropTypes.number.isRequired,
    colIndex: PropTypes.number.isRequired,
    onMovePiece: PropTypes.func.isRequired,
    isSelected: PropTypes.bool,
    UCIMapping: PropTypes.string,
    onSquareClick: PropTypes.func.isRequired,
    isHighlight: PropTypes.bool,
    availableMoves: PropTypes.arrayOf(PropTypes.object).isRequired, 
};

export default Square;
