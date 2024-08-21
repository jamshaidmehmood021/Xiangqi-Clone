import React, { useEffect, useState } from 'react';
import './Board.scss';
import { parseFEN } from '../Utilities/parseFEN';

const Board = () => {
    const FEN = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR';
    const board = parseFEN(FEN);

    const [squareSize, setSquareSize] = useState(0);

    useEffect(() => {
        const calculateSizes = () => {
            const height = window.innerHeight - 200;
            const width = window.innerWidth - 200;
            
            const aspectRatio = 133 / 150;
            const calculateHeight = height  ;
            const calculatedWidth = height * aspectRatio;
            
            const size = Math.min(calculatedWidth / 9, calculateHeight / 10);
            console.log(size);
            setSquareSize(size);
        };

        calculateSizes();
        window.addEventListener('resize', calculateSizes);

        return () => {
            window.removeEventListener('resize', calculateSizes);
        };
    }, []);

    const backgroundSize = `${(squareSize - 8 ) * 9}px ${(squareSize - 8 )* 10}px`;
    const backgroundPosition = `${(squareSize - 6 ) * 0.7}px ${(squareSize - 6 ) * 0.5}px`;

    return (
        <div id='game-area'>
            <div className='board-wrapper'>
                <div
                    className="board-container"
                    style={{
                        width: squareSize * 9,
                        height: squareSize * 10,
                        backgroundSize: backgroundSize,
                        backgroundPosition: backgroundPosition,
                    }}
                >
                    <div className="game-grid">
                        {board.map((row, rowIndex) => (
                            <div key={rowIndex} className="row">
                                {row.map((piece, colIndex) => (
                                    <div key={colIndex} className={`square ${piece ? piece : ''}`}>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Board;


// import React, { useEffect, useState } from 'react';
// import './Board.scss';
// import { parseFEN } from '../Utilities/parseFEN';

// write use effect 
    // attach event listner windows and calculate the square sizes on the basis of total height 
    // aspect ratio = width / height prepare grid on the basis of this aspect ratio in the form of rows and columns also update the length and width of the grid on that basis

// const Board = () => {
//     const FEN = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR';
//     const board = parseFEN(FEN);

//     const [squareSize, setSquareSize] = useState(0);

//     useEffect(() => {
//         const calculateSizes = () => {
//             const height = window.innerHeight - 80; // Subtracting some padding or header size if needed
//             const aspectRatio = 133 / 150; // Width to Height ratio for a Xiangqi board
//             console.log(aspectRatio)
//             const calculatedWidth = height * aspectRatio;
//             const size = Math.min(calculatedWidth / 9, height / 10);
//             console.log(size)
//             setSquareSize(size);
//         };

//         calculateSizes();
//         window.addEventListener('resize', calculateSizes);

//         return () => {
//             window.removeEventListener('resize', calculateSizes);
//         };
//     }, []);

//     return (
//         <div id='game-area'>
//                 <div className='board-container' style={{ width: squareSize * 9, height: squareSize * 10 }}>
//                     <div className="game-grid">
//                         {board.map((row, rowIndex) => (
//                             <div key={rowIndex} className="row">
//                                 {row.map((piece, colIndex) => (
//                                     <div 
//                                         key={colIndex} 
//                                         className={`square ${piece ? piece : ''}`}
//                                         style={{ width: squareSize, height: squareSize }}
//                                     >
//                                     </div>
//                                 ))}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//     );
// };

// export default Board;

