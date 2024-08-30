import React from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';

import Piece from 'Components/BoardComponents/Piece';
import 'Components/BoardComponents/Square.scss';

const Square = ({
    piece = '',
    size,
    rowIndex,
    colIndex,
    onMovePiece,
    isSelected = false,
    onSquareClick,
    onDragStart,
    isHighlight,
    availableMoves = []
}) => {
    const [, drop] = useDrop({
        accept: 'piece',
        canDrop: (item) => {
            return availableMoves.some(move => move.row === rowIndex && move.col === colIndex);
        },
        drop: (item) => {
            if (item.rowIndex !== rowIndex || item.colIndex !== colIndex) {
                onMovePiece({ row: item.rowIndex, col: item.colIndex }, { row: rowIndex, col: colIndex });
            }
        },
    });

    const ref = React.useRef(null);
    drop(ref);

    const handleClick = () => {
        onSquareClick({ row: rowIndex, col: colIndex });
    };

    return (
        <div
            ref={ref}
            className={`square ${isHighlight ? 'highlight' : ''}`}
            style={{ width: size, height: size }}
            onClick={handleClick}
        >
            {piece && (
                <Piece
                    piece={piece}
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                    onSquareClick={onSquareClick}
                    onDragStart={onDragStart}
                    isSelected={isSelected}
                    availableMoves={availableMoves}
                    onPieceClick={() => onSquareClick({ row: rowIndex, col: colIndex })} 
                />
            )}
        </div>
    );
};

Square.propTypes = {
    piece: PropTypes.string,
    size: PropTypes.number.isRequired,
    rowIndex: PropTypes.number.isRequired,
    colIndex: PropTypes.number.isRequired,
    onMovePiece: PropTypes.func.isRequired,
    isSelected: PropTypes.bool,
    onSquareClick: PropTypes.func.isRequired,
    onDragStart: PropTypes.func.isRequired,
    isHighlight: PropTypes.bool,
    availableMoves: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Square;
