import * as React from 'react';
import useStore from "../store";
import { styled, alpha } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import CommonButton from "./CommonButton";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function MenuButton() {
    const { initialJsonState, fetchJsonInitialState, updateInitialJsonValue, postParametersProposal } = useStore(state => ({
        initialJsonState: state.initialJsonState,
        fetchJsonInitialState: state.fetchJsonInitialState,
        updateInitialJsonValue: state.updateInitialJsonValue,
        postParametersProposal: state.postParametersProposal
  }));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleResetInitialState = () => {
    if (initialJsonState) {
        updateInitialJsonValue(initialJsonState);
        postParametersProposal(initialJsonState);
    }
    handleClose();
  };

  const handleGetCardanoState = () => {
    fetchJsonInitialState();
    handleClose();
  };

  return (
    <div>
      <CommonButton fullWidth={false} variant="text" text="Reset" onClick={handleClick} endIcon={<KeyboardArrowDownIcon />} />
    
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleResetInitialState} disableRipple>
          <EditIcon />
          Initial Values
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleGetCardanoState} disableRipple>
          <ArchiveIcon />
          Cardano State
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
