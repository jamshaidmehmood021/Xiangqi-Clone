import React from 'react';
import PropTypes from 'prop-types';
import Lottie from 'react-lottie';

import { ANIMATION_JSON, ANIMATION_TYPES } from 'Components/Animations/constants/constants';

const Animation = (props) => {
  const { options, width, height, customStyle, type } = props;

  if (!options) return false;

  return (
    <Lottie
      options={{
        loop: false,
        autoplay: true,
        animationData: ANIMATION_JSON[type],
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
          ...options.rendererSettings,
        },
        ...options,
      }}
      width={width}
      height={height}
      style={customStyle}
      isClickToPauseDisabled
    />
  );
};

Animation.propTypes = {
  options: PropTypes.object.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  customStyle: PropTypes.object,
  type: PropTypes.oneOf(ANIMATION_TYPES),
};

export default Animation;
