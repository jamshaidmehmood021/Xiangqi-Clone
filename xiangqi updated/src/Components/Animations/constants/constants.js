import checkJSON from 'Components/Animations/constants/check.json';
import checkMateJSON from 'Components/Animations/constants/checkmate.json';

export const CHECK = 'animations/check';
export const CHECKMATE = 'animations/checkmate';

export const ANIMATION_TYPES = [CHECK, CHECKMATE ];

export const ANIMATION_JSON = {
  [CHECK]: checkJSON,
  [CHECKMATE]: checkMateJSON,
};
