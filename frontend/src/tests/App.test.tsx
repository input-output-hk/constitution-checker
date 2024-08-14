import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';
import useStore from '../store/store'; 
import { mockInitialJsonState } from './mockData';

describe('Test the useEffect hooks in app component are firing correctly', () => {
  test('fetchJsonInitialState is called once on component mount', async () => {
    // Define the mock function
    const fetchJsonInitialState = jest.fn();

    // Update the mocked store with the mock function
    useStore.setState({
      fetchJsonInitialState,
    });

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
      initialJsonState: undefined, 
    });

    render(<App />);

    // Update state of mock store using the mock data
    useStore.setState({
      initialJsonState: mockInitialJsonState,  
    });

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

  test('shows error state when there is an error', () => {
    const errorMessage = 'Failed to fetch data';

    // Set the initial state of the mock store
    useStore.setState({
      error: errorMessage,
    });

    render(<App />);

    // Test if the error message is displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});