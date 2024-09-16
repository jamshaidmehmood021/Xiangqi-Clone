export const indexToUCI = (index) => {
    const indexToLetter = (index) => 'abcdefghi'[index];
    return `${indexToLetter(index.col)}${9 - index.row}`;
};
