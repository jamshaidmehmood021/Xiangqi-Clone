export const parseFEN = (fen) => {
  const pieceMap = {
    'r': 'b_chariot',
    'n': 'b_horse',
    'b': 'b_elephant',
    'a': 'b_advisor',
    'k': 'b_general',
    'c': 'b_cannon',
    'p': 'b_soldier',
    'R': 'r_chariot',
    'N': 'r_horse',
    'B': 'r_elephant',
    'A': 'r_advisor',
    'K': 'r_general',
    'C': 'r_cannon',
    'P': 'r_soldier'
  };

  const [boardFEN, turn] = fen.split(' ').slice(0, 2);
  
  const rows = boardFEN.split('/');
  const board = rows.map((row) => {
    const cells = [];
    for (let char of row) {
      if (isNaN(char)) {
        cells.push(pieceMap[char] || null);
      } else {
        cells.push(...Array(parseInt(char)).fill(null));
      }
    }
    return cells;
  });

  return { board, turn };
};
