export const generateFENFromBoard = (board) => {
    
    return board.map(row => {
        let emptySpacesCount = 0;
        let fenRow = '';

        row.forEach(cell => {
            if (cell === '') {
                emptySpacesCount++;
            } else {
                if (emptySpacesCount > 0) {
                    fenRow += emptySpacesCount;
                    emptySpacesCount = 0;
                }
                fenRow += cell;
            }
        });

        if (emptySpacesCount > 0) {
            fenRow += emptySpacesCount;
        }

        return fenRow;
    }).join('/');
};
