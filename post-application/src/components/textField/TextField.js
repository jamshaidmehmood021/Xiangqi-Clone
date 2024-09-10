import React from 'react';
import { TextField as MuiTextField, FormControl, FormLabel } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  textField: {
    marginBottom: theme.spacing(1),
  },
}));

const ReusableTextField = ({ id, name, label, type = 'text', error, helperText, ...props }) => {
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
};

export default ReusableTextField;
