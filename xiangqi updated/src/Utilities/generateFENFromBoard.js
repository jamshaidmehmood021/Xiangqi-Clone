export const generateFENFromBoard = (board, turn, castling = '-', halfMove = 0, fullMove = 1) => {
    if (!Array.isArray(board) || board.length !== 10 || !board.every(row => row.length === 9)) {
        throw new Error('Invalid board dimensions. Expected 10 rows and 9 columns.');
    }
    const reversePieceMap = {
        'b_chariot': 'r',
        'b_horse': 'n',
        'b_elephant': 'b',
        'b_advisor': 'a',
        'b_general': 'k',
        'b_cannon': 'c',
        'b_soldier': 'p',
        'r_chariot': 'R',
        'r_horse': 'N',
        'r_elephant': 'B',
        'r_advisor': 'A',
        'r_general': 'K',
        'r_cannon': 'C',
        'r_soldier': 'P',
      };
      
    const boardFEN = board.map(row => {
        let emptySpacesCount = 0;
        let fenRow = '';

        row.forEach(cell => {
            if (cell === null) { 
                emptySpacesCount++;
            } else {
                if (emptySpacesCount > 0) {
                    fenRow += emptySpacesCount;
                    emptySpacesCount = 0;
                }
                fenRow += reversePieceMap[cell] || ''; 
            }
        });
        if (emptySpacesCount > 0) {
            fenRow += emptySpacesCount;
        }

        return fenRow;
    }).join('/');
    return `${boardFEN} ${turn} ${castling} ${halfMove} ${fullMove}`;
};
