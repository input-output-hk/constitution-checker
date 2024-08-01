import Button, { ButtonProps } from "@mui/material/Button";

interface PHAButtonProps {
  disabled?: boolean;
  size?: ButtonProps['size'];
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: ButtonProps['variant']; 
  text?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>; 
}

export default function PHACommonButton({ disabled, size='medium', fullWidth, startIcon, variant='contained', text, onClick }: PHAButtonProps) {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (onClick) {
      onClick(event);
    }
    event.currentTarget.blur();
  };

export default function PHACommonButton({ disabled, size='medium', fullWidth, startIcon, endIcon, variant='contained', text, onClick }: PHAButtonProps) {
  return (
    <Button disabled={disabled} size={size} fullWidth={fullWidth} startIcon={startIcon} endIcon={endIcon} variant={variant} disableFocusRipple disableRipple onClick={handleClick}>{text}</Button>
  );
}