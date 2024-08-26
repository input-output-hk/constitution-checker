//React-testing-library imports
import { render, screen, waitFor } from '@testing-library/react';

//Store imports
import useStore from '../store/store'; 

//Mock imports
import { mockInitialJsonState } from './mockData';

//local components
import App from '../App';


describe('Test the useEffect hooks in app component are firing correctly', () => {
  test('fetchJsonInitialState is called once on component mount', async () => {
    // Define the mock function
    const fetchJsonInitialState = jest.fn();

    // Update the mocked store with the mock function
    useStore.setState({
      fetchJsonInitialState,
    });

    // Render the component
    render(<App />);

    // Wait for useEffect to run and ensure fetchJsonInitialState was called
    await waitFor(() => {
      expect(fetchJsonInitialState).toHaveBeenCalledTimes(1);
    });
  });

  test('postParametersProposal is called when initialJsonState changes', async () => {
    // Define the mock function
    const postParametersProposal = jest.fn();

    // Update the mocked store with the mock function and initial state
    useStore.setState({
      postParametersProposal,
      initialJsonState: mockInitialJsonState, 
    });
    
    render(<App />);

    // Wait for useEffect to run and ensure postParametersProposal was called
    await waitFor(() => {
      expect(postParametersProposal).toHaveBeenCalledTimes(1);
    });
  });
});

describe('Test that the loading and error states are displayed correctly', () => {
  test('shows loading state when validationResults is undefined', () => {
    // Set the initial state of the mock store
    useStore.setState({
      validationResults: undefined,
      error: null,
    });

    render(<App />);

    // Test if the CircularProgress component is displayed
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('shows error state when there is an error', async () => {
    const errorMessage = 'Failed to fetch data';

    // Set the initial state of the mock store
    useStore.setState({
      error: errorMessage,
    });    

    render(<App />);

    // Test if the error message is displayed
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});