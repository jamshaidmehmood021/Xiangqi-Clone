import React, {memo} from 'react';
import { TextField as MuiTextField, FormControl, FormLabel } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  textField: {
    marginBottom: theme.spacing(1),
  },
}));

const ReusableTextField = memo(({ id, name, label, type = 'text', error, helperText, ...props }) => {
  const classes = useStyles();

  return (
    <FormControl fullWidth>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <MuiTextField
        id={id}
        name={name}
        type={type}
        variant="outlined"
        error={error}
        helperText={helperText}
        className={classes.textField}
        {...props}
      />
    </FormControl>
  );
});
ReusableTextField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'password', 'email', 'number']),
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

export default ReusableTextField;
