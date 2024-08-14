import { render, waitFor } from '@testing-library/react';
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

    // Render the component
    render(<App />);

    // Wait for useEffect to run and ensure fetchJsonInitialState was called
    await waitFor(() => {
      expect(fetchJsonInitialState).toHaveBeenCalledTimes(1);
    });
  });

  test('postParametersProposal is called when initialJsonState changes', async () => {
    // Define the mock functions
    const postParametersProposal = jest.fn();

    // Update the mocked store with the mock function and initial state
    useStore.setState({
      postParametersProposal,
      initialJsonState: undefined, 
    });

    // Render the component
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
