import React, { useEffect, useState } from 'react';
import './Board.scss';
import { parseFEN } from '../Utilities/parseFEN';

const Board = () => {
    const FEN = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR';
    const board = parseFEN(FEN);

    const [size, setSize] = useState(0);

    const calculateSizes = () => {
        const height = window.innerHeight * 0.8;
        const width = window.innerWidth * 0.8;
        
        const aspectRatio = 133 / 150;
        let calculateHeight = height;
        let calculatedWidth = calculateHeight * aspectRatio;

        if(height > width) {
            calculateHeight = width;
            calculatedWidth = calculateHeight * aspectRatio;
        }
        
        setSize({width: calculatedWidth, height: calculateHeight})
    };
    useEffect(() => {

        calculateSizes();
        window.addEventListener('resize', calculateSizes);

        return () => {
            window.removeEventListener('resize', calculateSizes);
        };
    }, []);
    const squareSizeCalc = size.width / 10;

    return (
        <div id='game-area'>
            <div className='board-wrapper'>
                <div
                    className="board-container"
                    style={{
                        width: size.width + squareSizeCalc,
                        height: size.height + squareSizeCalc,
                        backgroundSize: `${size.width}px ${size.height}px`,
                        backgroundPosition: `${squareSizeCalc / 2}px ${squareSizeCalc / 2}px`,
                    }}
                >
                    <div className="game-grid">
                        {board.map((row, rowIndex) => (
                            <div key={rowIndex} className="row" style={{height: size.height / 9}}>
                                {row.map((piece, colIndex) => (
                                    <div key={colIndex} className={`square`} style={{width: (size.width + squareSizeCalc) / 9}}>
                                        <div className={`${piece ? piece : ''}`} />
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

