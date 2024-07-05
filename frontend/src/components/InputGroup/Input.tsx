import { useState, useRef } from "react";
import { TextField, InputAdornment, Tooltip } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import IconButton from "../IconButton";

import type { InputProps } from "./";

const Input = (props: InputProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const error = props.getFieldState(props.field.name, props.formState).error !== undefined;

  const handleFocus = (event: any) => {
    setIsFocused(true);
  };

  const handleBlur = (event: any) => {
    setIsFocused(false);
    props.register(props.field.name, { required: props.field.required }).onBlur(event);
  };

  const handleClear = () => {
    props.setValue(props.field.name, undefined);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };
  
  return (
    <TextField
      fullWidth
      type="text"
      size="small"
      variant="outlined"
      label={props.field.label}
      error={error}
      { ...props.register(props.field.name, { required: props.field.required }) }
      onFocus={handleFocus}
      onBlur={handleBlur}
      inputRef={inputRef}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {error && !isFocused ? (
              <Tooltip title={props.getFieldState(props.field.name, props.formState).error?.message}>
                <ErrorOutlineOutlinedIcon />
              </Tooltip>
            ) : (
              <IconButton
                icon={<CancelOutlinedIcon />}
                onMouseDown={handleClear}
                color="success"
                size="small"
              />
            )}
          </InputAdornment>
        ),
      }}
      InputLabelProps={{
        color: 'primary',
        shrink: props.getValues(props.field.name) !== undefined && props.getValues(props.field.name) !== ''
      }}
    />
  );
};

export default Input;