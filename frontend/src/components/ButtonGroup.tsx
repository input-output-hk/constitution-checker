import { useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

interface ButtonInfo {
  label: string;
  onClick: () => void;  
}

interface PHAButtonGroupProps {
  buttons: ButtonInfo[];  
}

export default function PHAButtonGroup({ buttons }: PHAButtonGroupProps) {
  const [selected, setSelected] = useState(3);

  const handleButtonClick = (index: number, onClick: () => void) => {
    return () => {
      setSelected(index);
      onClick();
    };
  };

  return (
    <ButtonGroup variant="outlined"  disableRipple>
      {buttons.map((button, index) => (
        <Button
        key={index}
        onClick={handleButtonClick(index, button.onClick)}
        sx={{ 
          backgroundColor: index === selected ? 'rgba(57, 82, 205, 0.12)' : '#fff',
        }}
      >
        {button.label}
      </Button>
      ))}
    </ButtonGroup>
  );
}