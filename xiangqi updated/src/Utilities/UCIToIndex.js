export const UCIToIndex = (uci) => {
    const letterToIndex = (letter) => 'abcdefghi'.indexOf(letter);
    const col = letterToIndex(uci[0]);
    const row = 9 - parseInt(uci[1]);

    return { row, col };
};
