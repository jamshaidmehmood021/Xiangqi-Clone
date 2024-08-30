export const parseUCI = (move, fn = (rowIndex) => rowIndex) => {
    // convert uci for xiangqi package and for frontend
    // based on fn passed for row increment or decrement.
    // for xiangqi package subtract - 1 from row
    // used in renderActiveMove function in gamePlay
    const match = move.match(/[a-i]|[0-9]+/g);
    const c1 = match[0];
    const r1 = fn(+match[1]);
    const c2 = match[2];
    const r2 = fn(+match[3]);
    return {
      uci: `${c1}${r1}${c2}${r2}`,
      move: {
        c1,
        r1,
        c2,
        r2,
      },
    };
  };
