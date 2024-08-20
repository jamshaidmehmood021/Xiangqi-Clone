export const validChariotMoves = (row, col, toRow, toCol, board) => {
    if (row !== toRow && col !== toCol) return false; 
    const rStep = row === toRow ? 0 : (toRow - row) / Math.abs(toRow - row);
    const cStep = col === toCol ? 0 : (toCol - col) / Math.abs(toCol - col);
  
    // this is the condition is used to ensure that chariot will not jump the pieces
    for (let r = row + rStep, c = col + cStep; r !== toRow || c !== toCol; r += rStep, c += cStep) {
      if (board[r][c]) return false; 
    }
  
    return true;
  };
  
  export const validHorseMoves = (fromRow, fromCol, toRow, toCol, board) => {
    const potentialMoves = [
      [fromRow - 2, fromCol - 1], [fromRow - 2, fromCol + 1],
      [fromRow + 2, fromCol - 1], [fromRow + 2, fromCol + 1],
      [fromRow - 1, fromCol - 2], [fromRow - 1, fromCol + 2],
      [fromRow + 1, fromCol - 2], [fromRow + 1, fromCol + 2]
    ];
  
    if (potentialMoves.some(([r, c]) => r === toRow && c === toCol)) {
      const dx = Math.abs(fromRow - toRow);
      const dy = Math.abs(fromCol - toCol);
  
      if (dx === 2 && dy === 1) {
        const blockingRow = fromRow + (toRow - fromRow) / 2;
        if (board[blockingRow][fromCol] === null) {
          return true;
        }
      } else if (dx === 1 && dy === 2) {
        const blockingCol = fromCol + (toCol - fromCol) / 2;
        if (board[fromRow][blockingCol] === null) {
          return true;
        }
      }
    }
  
    return false; 
  };
  
  
  export  const validElephantMoves = (row, col, toRow, toCol, board) => {
    const rowDiff = Math.abs(row - toRow);
    const colDiff = Math.abs(col - toCol);
    if (rowDiff === 2 && colDiff === 2) {
      const midRow = (row + toRow) / 2;
      const midCol = (col + toCol) / 2;
      if (board[midRow][midCol]) return false;
      return true;
    }
    return false;
  };
  
  
  export  const validAdvisorMoves = (row, col, toRow, toCol, board) => {
    const rowDiff = Math.abs(row - toRow);
    const colDiff = Math.abs(col - toCol);
    if (rowDiff === 1 && colDiff === 1 && isInPalace(toRow, toCol)) {
      return true;
    }
    return false;
  };
  
  export  const isInPalace = (row, col) => {
    return (row >= 0 && row <= 2 && col >= 3 && col <= 5) || (row >= 7 && row <= 9 && col >= 3 && col <= 5);
  };
  
  export  const validGeneralMoves = (row, col, toRow, toCol, board) => {
    const rowDiff = Math.abs(row - toRow);
    const colDiff = Math.abs(col - toCol);
    if (rowDiff <= 1 && colDiff <= 1 && isInPalace(toRow, toCol)) {
      return true;
    }
    return false;
  };
  
  export  const validCannonMoves = (row, col, toRow, toCol, board) => {
    if (row !== toRow && col !== toCol) return false; 
    const rStep = row === toRow ? 0 : (toRow - row) / Math.abs(toRow - row);
    const cStep = col === toCol ? 0 : (toCol - col) / Math.abs(toCol - col);
    let pieceInBetween = false;
  
    for (let r = row + rStep, c = col + cStep; r !== toRow || c !== toCol; r += rStep, c += cStep) {
      if (board[r][c]) {
        if (pieceInBetween) return false; 
        pieceInBetween = true;
      }
    }
  
    if (pieceInBetween && board[toRow][toCol]) return true; 
    return !pieceInBetween && !board[toRow][toCol]; 
  };
  
  export const validSoldierMoves = (fromRow, fromCol, toRow, toCol, board) => {
    const piece = board[fromRow][fromCol];

    const isRed = piece[0] === 'r';
    const beforeRiver = isRed ? fromRow >= 5 : fromRow <= 4;
    if (beforeRiver) {
        if (isRed) {
            return toRow === fromRow - 3 && toCol === fromCol;
        } else {
            return toRow === fromRow + 3 && toCol === fromCol;
        }
    } else {
        if (isRed) {
            return (toRow === fromRow - 1 && toCol === fromCol) || (toRow === fromRow && Math.abs(toCol - fromCol) === 1);
        } else {
            return (toRow === fromRow + 1 && toCol === fromCol) || (toRow === fromRow && Math.abs(toCol - fromCol) === 1);
        }
    }
  };  
  