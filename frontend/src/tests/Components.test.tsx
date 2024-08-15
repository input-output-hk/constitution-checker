import { render, screen, fireEvent } from '@testing-library/react';
import SaveIcon from '@mui/icons-material/Save';
import PHACommonButton from '../components/CommonButton'; 
import PHAIconButton from '../components/IconButton';

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
