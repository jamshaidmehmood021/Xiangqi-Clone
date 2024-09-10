import React, { useContext, memo } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { AuthContext } from 'context/authContext';

const ProtectedRoute = memo(({ element: Component, ...rest }) => {
  const { user } = useContext(AuthContext);

  return user ? <Component {...rest} /> : <Navigate to="/" />;
});

ProtectedRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
};

export default ProtectedRoute;