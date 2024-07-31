import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import useStore from "../store";

const Search = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: alpha(theme.palette.containerLowest.main, 0.15),
  maxWidth: '350px',
  borderRadius: '20px',
  border: `1px solid ${theme.palette.outline.main}`,
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  fontSize: '12px',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 1),
    // vertical padding + font size from searchIcon
    paddingLeft: '1em',
    transition: theme.transitions.create('width'),
  },
}));

export default function SearchBar() {
  const { searchValue, changeSearchValue } = useStore();

  const handleCancelSearch = () => {
    changeSearchValue('');
  }

  return (
    <Search>
    <StyledInputBase placeholder="Search…" value={searchValue} onChange={e => changeSearchValue(e.target.value)} />
    <SearchIconWrapper>
      {!searchValue ? <SearchIcon color='action'/> : <ClearOutlinedIcon color='action' onClick={handleCancelSearch}/>}
        
    </SearchIconWrapper>
    </Search>
  );
}
