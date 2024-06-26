import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import CommonButton from './CommonButton';
import CircleIcon from '@mui/icons-material/Circle';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';

interface PHATableRowProps {
  name: string;
  status?: string;
  value: number | string | undefined;
}

// Maps custom status values to Material-UI color values
const statusToColor = (status: string): "disabled" | "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined => {
  switch (status) {
      case "active": return "success"; // Example: 'active' maps to 'success'
      case "inactive": return "error"; // Example: 'inactive' maps to 'error'
      case "pending": return "warning"; // Example: 'pending' maps to 'warning'
      default: return "disabled";
  }
}

export default function PHATableRow({name, status="disabled", value}: PHATableRowProps) {
  const iconColor = statusToColor(status);

  return (
    <TableRow
    hover
    sx={{ '&:last-child td, &:last-child th': { border: 0 }, }}
  >
    <TableCell component="th" scope="row">
    <CircleIcon color={iconColor} sx={{width: '12px', height: '12px', verticalAlign: 'middle', marginRight: '8px'}} />
      {name}
    </TableCell>
    <TableCell align="right">{value}</TableCell>
    <TableCell align="right">
      <CommonButton variant='text' text='View More Details' startIcon={<RemoveRedEyeOutlinedIcon/>}/>
    </TableCell>
  </TableRow>
  );
}
