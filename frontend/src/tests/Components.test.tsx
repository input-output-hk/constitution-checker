import { render, screen, fireEvent } from '@testing-library/react';
import PHACommonButton from '../components/CommonButton'; 

describe('Tests to check if the CommonButton component is working as expected', () => {
  test('renders with default props', () => { 
    render(<PHACommonButton text="Default Button"/>);
    const buttonElement = screen.getByRole('button', { name: /default button/i });
    
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent('Default Button'); 
    expect(buttonElement).toBeEnabled(); 
    expect(buttonElement).toHaveClass('MuiButton-contained', 'MuiButton-sizeMedium');
  });

  test('renders with disabled props', () => { 
    render(<PHACommonButton text="Disabled Button" disabled/>);
    const buttonElement = screen.getByRole('button', { name: /disabled button/i }); 
    
    expect(buttonElement).toBeDisabled(); 
  });

  test('renders with variant props', () => { 
    render(<PHACommonButton text="Outlined Button" variant="outlined" />);
    const buttonElement = screen.getByRole('button', { name: /outlined button/i }); 

    expect(buttonElement).toHaveTextContent('Outlined Button'); 
    expect(buttonElement).toHaveClass('MuiButton-outlined');
  });

  test('onClick handler and blur called after click', () => {
    const handleClick = jest.fn(); 

    render(<PHACommonButton text="Click Button" onClick={handleClick} />);

    const buttonElement = screen.getByRole('button', { name: /click button/i });

    fireEvent.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(buttonElement).not.toHaveFocus();
  });
});
