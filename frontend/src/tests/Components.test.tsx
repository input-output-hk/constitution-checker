//React-testing-library imports
import { render, screen, fireEvent, act } from '@testing-library/react';

//Mui imports
import SaveIcon from '@mui/icons-material/Save';

//Store imports
import useStore from '../store/store';

//Mock imports
import { mockInitialJsonState } from './mockData';

//local components
import PHACommonButton from '../components/CommonButton'; 
import PHAIconButton from '../components/IconButton';
import MenuButton from '../components/MenuButton';
import NavTabs from '../components/NavTabs';

describe('PHACommonButton component tests', () => {
  test('renders with default props', () => { 
    render(<PHACommonButton text="Default Button"/>);
    const commonButton = screen.getByRole('button', { name: /default button/i });
    
    expect(commonButton).toBeInTheDocument();
    expect(commonButton).toHaveTextContent('Default Button'); 
    expect(commonButton).toBeEnabled(); 
    expect(commonButton).toHaveClass('MuiButton-contained', 'MuiButton-sizeMedium');
  });

  test('renders with disabled props', () => { 
    render(<PHACommonButton text="Disabled Button" disabled/>);
    const commonButton = screen.getByRole('button', { name: /disabled button/i }); 
    
    expect(commonButton).toBeDisabled(); 
  });

  test('renders with variant props', () => { 
    render(<PHACommonButton text="Outlined Button" variant="outlined" />);
    const commonButton = screen.getByRole('button', { name: /outlined button/i }); 

    expect(commonButton).toHaveTextContent('Outlined Button'); 
    expect(commonButton).toHaveClass('MuiButton-outlined');
  });

  test('onClick handler and blur called after click', () => {
    const handleClick = jest.fn(); 

    render(<PHACommonButton text="Click Button" onClick={handleClick} />);

    const commonButton = screen.getByRole('button', { name: /click button/i });

    fireEvent.click(commonButton);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(commonButton).not.toHaveFocus();
  });
});


describe('PHAIconButton component tests', () => {
  test('renders with default props', () => { 
    render(<PHAIconButton icon={<SaveIcon />}/>);
    const iconButton = screen.getByRole('button');
    
    expect(iconButton).toBeInTheDocument();
    expect(iconButton).toBeEnabled(); 
    expect(iconButton).toHaveClass('MuiIconButton-colorPrimary', 'MuiIconButton-sizeMedium');
  });

  test('renders with disabled props', () => { 
    render(<PHAIconButton icon={<SaveIcon />} disabled/>);
    const iconButton = screen.getByRole('button'); 
    
    expect(iconButton).toBeDisabled(); 
  });

  test('renders with color props', () => { 
    render(<PHAIconButton icon={<SaveIcon />} color="success" />);
    const iconButton = screen.getByRole('button'); 

    expect(iconButton).toHaveClass('MuiIconButton-colorSuccess');
  });

  test('onClick handler and blur called after click', () => {
    const handleClick = jest.fn(); 

    render(<PHAIconButton icon={<SaveIcon />} onClick={handleClick} />);

    const iconButton = screen.getByRole('button');

    fireEvent.click(iconButton);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});


describe('MenuButton component tests', () => {
  test('renders child components when open', () => { 
    render(<MenuButton />);
    
    const buttonElement = screen.getByText('Reset');
    expect(buttonElement).toBeInTheDocument();
    
    fireEvent.click(buttonElement);

    expect(screen.getByRole('menu', { hidden: true })).toBeInTheDocument();
    expect(screen.getByText('Initial Values')).toBeInTheDocument();
    expect(screen.getByText('Cardano State')).toBeInTheDocument();
  });

  test('opens the menu when the button is clicked', () => {
    render(<MenuButton />);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Reset'));

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('closes the menu when a menu item is clicked', () => {
    render(<MenuButton />);

    fireEvent.click(screen.getByText('Reset'));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Initial Values'));

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('Initial values menu button calls expected state changes', () => {
    const updateInitialValues = jest.fn();
    const postParametersProposal = jest.fn();

    useStore.setState({
      initialJsonState: mockInitialJsonState,
      updateInitialValues,
      postParametersProposal,
    });

    render(<MenuButton />);
    fireEvent.click(screen.getByText('Reset'));
    fireEvent.click(screen.getByText('Initial Values'));

    expect(updateInitialValues).toHaveBeenCalledTimes(1);
    expect(postParametersProposal).toHaveBeenCalledTimes(1);
  });

  
  test('Cardano state menu button calls expected state changes', () => {
    const fetchJsonInitialState = jest.fn();

    useStore.setState({
      initialJsonState: mockInitialJsonState,
      fetchJsonInitialState,
    });

    render(<MenuButton />);
    fireEvent.click(screen.getByText('Reset'));
    fireEvent.click(screen.getByText('Cardano State'));

    expect(fetchJsonInitialState).toHaveBeenCalledTimes(1);
  });
});


describe('NavTabs component tests', () => {
  test('tabs render correctly with correct default selected props', () => { 
    const handleClick = jest.fn();
    render(<NavTabs value="Proposal Parameters" onChange={handleClick}/>);

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    const tabElements = screen.getAllByRole('tab');
    expect(screen.getByText('Proposal Parameters')).toBeInTheDocument(); 
    expect(screen.getByText('Proposal Parameters')).toHaveClass('Mui-selected'); 
    expect(tabElements[0]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Guardrails')).toBeInTheDocument();
    expect(tabElements[1]).toHaveAttribute('aria-selected', 'false');
  });

  test('tabs render props with second tab selected', () => { 
    const handleClick = jest.fn();
    render(<NavTabs value="Guardrails" onChange={handleClick}/>);

    const tabElements = screen.getAllByRole('tab');
    expect(tabElements[0]).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByText('Guardrails')).toHaveClass('Mui-selected'); 
    expect(tabElements[1]).toHaveAttribute('aria-selected', 'true');
  });

  test('function called when tab clicked on', async () => { 
    const changeTab = jest.fn();
    render(<NavTabs value="Proposal Parameters" onChange={changeTab}/>);

    await act(async () => {
      screen.getByText(/guardrails/i).click();
    });

    expect(changeTab).toHaveBeenCalledTimes(1);
    expect(changeTab).toHaveBeenCalledWith(expect.any(Object), 'Guardrails');
  });
});