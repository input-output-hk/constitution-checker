import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App'; 
import useStore from '../store'; 

describe('Test the useEffect hooks in app component are firing correctly', () => {
  test('fetchJsonInitialState is called once on component mount', async () => {
    // define the mock function
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
});