//Mui imports
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import InputBase from "@mui/material/InputBase";

//Store imports
import useStore from "../store/store";

const Search = styled("div", {
  name: "MuiSearch",
  slot: 'Root',
})``;

const SearchIconWrapper = styled("div", {
  name: "MuiSearchIcon",
  slot: 'Root',
})``;

const StyledInputBase = styled(InputBase, {
  name: "MuiSearchInput",
  slot: 'Root',
})``;

export default function SearchBar() {
  const { searchValue } = useStore(state => ({
    searchValue: state.searchValue,
  }));

  const handleCancelSearch = () => {
    useStore.setState({searchValue: ''});
  }

  return (
    <Search>
    <StyledInputBase placeholder="Search…" value={searchValue} onChange={e => useStore.setState({searchValue: e.target.value})} />
    <SearchIconWrapper>
      {!searchValue ? <SearchIcon color='action'/> : <ClearOutlinedIcon color='action' onClick={handleCancelSearch}/>}
        
    </SearchIconWrapper>
    </Search>
  );
}
