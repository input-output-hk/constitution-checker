//React-testing-library imports
import { render, screen } from '@testing-library/react';

//Store imports
import useStore from '../store/store'; 

//Mocks
import { mockCurrentJsonState, mockValidationResult } from './mockData';

//local components
import PHATableRow from '../compositions/Table/BodyTableRow'; 
import BasicTable from '../compositions/Table/TableContainer';


describe('PHATableRow Component tests', () => {
  test('renders correctly with all child components', () => {
    useStore.setState({
        currentTab: 'Proposal Parameters',
    });

    const mockProps = {
      name: 'txFeePerByte',
      status: 'disabled',
      value: 44,
    };

    render(<PHATableRow {...mockProps} />);
    
    expect(screen.getByText('txFeePerByte')).toBeInTheDocument();
    expect(screen.getByText('44')).toBeInTheDocument(); 
    expect(screen.getByRole('button', {name: /View More Details/i })).toBeInTheDocument();
    const circleIcon = screen.getByTestId('CircleIcon');
    expect(circleIcon).toBeInTheDocument(); 
    expect(circleIcon).toHaveClass('MuiSvgIcon-colorDisabled');
  });

  test('check active status to have correct color', () => {
    const mockProps = {
      name: 'txFeePerByte',
      status: 'active',
      value: 44,
    };

    render(<PHATableRow {...mockProps} />);

    expect(screen.getByTestId('CircleIcon')).toHaveClass('MuiSvgIcon-colorSuccess');
  });

  test('check inactive status to have correct color', () => {
    const mockProps = {
      name: 'txFeePerByte',
      status: 'inactive',
      value: 44,
    };

    render(<PHATableRow {...mockProps} />);

    expect(screen.getByTestId('CircleIcon')).toHaveClass('MuiSvgIcon-colorError');
  });

  test('check notMandatory status to have correct color', () => {
    const mockProps = {
      name: 'txFeePerByte',
      status: 'notMandatory',
      value: 44,
    };

    render(<PHATableRow {...mockProps} />);

    expect(screen.getByTestId('CircleIcon')).toHaveClass('MuiSvgIcon-colorSecondary');
  });
});


describe('BasicTable Component Tests', () => {
    beforeEach(() => {
      useStore.setState({
        currentTab: 'Proposal Parameters',
        currentJsonState: mockCurrentJsonState,
        validationResults: mockValidationResult,
      });
    });
  
    test('renders correctly with all default child components', () => {
      render(<BasicTable />);
  
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /export updated proposal json/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    test('renders child components on Guardrail tab', () => {
        useStore.setState({
            currentTab: 'Guardrails',
        });

        render(<BasicTable />);
    
        expect(screen.getByRole('button', { name: /export guardrail results/i })).toBeInTheDocument();
      });
  });