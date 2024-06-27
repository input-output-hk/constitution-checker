import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import IconButton from './IconButton';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Tooltip from '@mui/material/Tooltip';

interface PHATextFieldProps {
    defaultValue: TextFieldProps['defaultValue'];
    error?: TextFieldProps['error'];
    fullWidth?: TextFieldProps['fullWidth'];
    helperText?: TextFieldProps['helperText'];
    label: TextFieldProps['label'];
    onChange?: (value: number | number[] | { [key: string]: number } | { [key: string]: number[] }) => void;
}

export default function PHATextField({defaultValue, error, fullWidth, helperText, label, onChange}: PHATextFieldProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleClear = () => {
    setValue('');
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    let newValue: number | number[] | { [key: string]: number } | { [key: string]: number[] };

    if (inputValue.includes('/')) {
      // Split by '/' and convert each part to a number array
      newValue = inputValue.split('/').map((val) => parseFloat(val));
    } else if (inputValue.includes(';')) {
      // For nested objects with arrays, assume the format "key1:1/2;key2:3/4"
      newValue = inputValue.split(';').reduce((acc, part) => {
        const [key, values] = part.split(':');
        acc[key] = values.split('/').map((val) => parseFloat(val));
        return acc;
      }, {} as { [key: string]: number[] });
    } else {
      // Convert the value to a single number
      newValue = parseFloat(inputValue);
    }

    setValue(inputValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
        <TextField
          inputRef={inputRef}
          value={value}
          onChange={handleChange}
          error={error}
          fullWidth={fullWidth}
          helperText={helperText}
          label={label}
          size="small"
          InputLabelProps={{color: "primary"}}
          onFocus={handleFocus}
          onBlur={handleBlur}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {error && !isFocused ? (
                  <Tooltip title="Error Message"><ErrorOutlineOutlinedIcon /></Tooltip>
                ) : <IconButton icon={<CancelOutlinedIcon />} onMouseDown={handleClear} size="small" color='success' />}
              </InputAdornment>
            ),
          }}
        />
  );
}
