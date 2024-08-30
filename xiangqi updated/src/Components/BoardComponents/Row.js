import React from 'react';
import PropTypes from 'prop-types';
import Square from 'Components/BoardComponents/Square';

import "Components/BoardComponents/Row.scss";

const Row = React.memo((props) => {
    const { FEN, row, rowIndex, size, onMovePiece, selectedPiece, availableMoves, UCIMapping, onSquareClick, onDragStart } = props;

    return (
        <div className="row">
            {row.map((piece, colIndex) => {
                const isSelected = selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex;
                const isHighlight = availableMoves.some(move => move.row === rowIndex && move.col === colIndex);

                return (
                    <Square 
                        FEN={FEN}
                        key={colIndex} 
                        piece={piece} 
                        size={size} 
                        rowIndex={rowIndex} 
                        colIndex={colIndex} 
                        onMovePiece={onMovePiece} 
                        isSelected={isSelected} 
                        UCIMapping={UCIMapping[colIndex]} 
                        onSquareClick={onSquareClick} 
                        onDragStart={onDragStart} 
                        isHighlight={isHighlight} 
                        availableMoves={availableMoves} 
                    />
                );
            })}
        </div>
    );
});

Row.propTypes = {
    row: PropTypes.arrayOf(PropTypes.string).isRequired,
    rowIndex: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    onMovePiece: PropTypes.func.isRequired,
    selectedPiece: PropTypes.object,
    availableMoves: PropTypes.arrayOf(PropTypes.shape({
        row: PropTypes.number.isRequired,
        col: PropTypes.number.isRequired,
    })).isRequired,
    UCIMapping: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSquareClick: PropTypes.func.isRequired,
    onDragStart: PropTypes.func.isRequired,
};

export default Row;
