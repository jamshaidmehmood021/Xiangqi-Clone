import React,{memo} from 'react';
import { Button as MuiButton } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  button: {
    borderRadius: theme.shape.borderRadius * 2,
    fontWeight: 'bold',
    padding: theme.spacing(1.5),
  },
}));

const Button = memo(({ variant = 'contained', color = 'primary', size = 'medium', onClick, children, ...props }) => {
  const classes = useStyles();
  
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      className={classes.button}
      onClick={onClick}
      {...props}
    >
      {children}
    </MuiButton>
  );
});
Button.propTypes = {
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  color: PropTypes.oneOf(['primary', 'secondary', 'default']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default Button;
