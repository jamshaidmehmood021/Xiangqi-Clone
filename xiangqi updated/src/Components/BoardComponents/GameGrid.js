import React from 'react';
import PropTypes from 'prop-types';
import Row from 'Components/BoardComponents/Row';
import { UCIMapping } from 'Utilities/UCIMapping';

import "Components/BoardComponents/GameGrid.scss";

const GameGrid = React.memo((props) => {
    const { FEN, board, size, onMovePiece, selectedPiece, availableMoves, onSquareClick, onDragStart } = props;

    return (
        <>
            {board.map((row, rowIndex) => (
                <Row 
                    FEN={FEN}
                    key={rowIndex} 
                    row={row} 
                    rowIndex={rowIndex} 
                    size={size} 
                    onMovePiece={onMovePiece} 
                    selectedPiece={selectedPiece} 
                    availableMoves={availableMoves} 
                    UCIMapping={UCIMapping[rowIndex]} 
                    onSquareClick={onSquareClick} 
                    onDragStart={onDragStart} 
                />
            ))}
       </>
    );
});

GameGrid.propTypes = {
    board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    size: PropTypes.number.isRequired,
    onMovePiece: PropTypes.func.isRequired,
    selectedPiece: PropTypes.object,
    availableMoves: PropTypes.arrayOf(PropTypes.shape({
        row: PropTypes.number.isRequired,
        col: PropTypes.number.isRequired,
    })).isRequired, 
    onSquareClick: PropTypes.func.isRequired,
    onDragStart: PropTypes.func.isRequired, 
};

export default GameGrid;
