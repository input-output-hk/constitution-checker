//React Imports
import * as React from 'react';

//Mui imports
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

//Store imports
import useStore from "../store/store";

//local components
import CommonButton from "./CommonButton";

export default function MenuButton() {
    const { initialJsonState, fetchJsonInitialState, updateInitialValues, postParametersProposal } = useStore(state => ({
        initialJsonState: state.initialJsonState,
        fetchJsonInitialState: state.fetchJsonInitialState,
        updateInitialValues: state.updateInitialValues,
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
        updateInitialValues(initialJsonState);
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
        <Menu
        id="demo-customized-menu"
        MenuListProps={{'aria-labelledby': 'demo-customized-button' }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        elevation={0}
        anchorOrigin={{ vertical: 'bottom',horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <MenuItem onClick={handleResetInitialState} disableRipple>
          <EditIcon />
          Initial Values
        </MenuItem>
        <Divider className='menuDivider' />
        <MenuItem onClick={handleGetCardanoState} disableRipple>
          <ArchiveIcon />
          Cardano State
        </MenuItem>
      </Menu>
    </div>
  );
}
