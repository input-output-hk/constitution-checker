//React-testing-library imports
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

//Store imports
import useStore from '../store/store';

//Mock imports
import { mockInitialJsonState, mockUpdateJsonState, mockValidationResult } from './mockData';

//local components
import PHAButtonGroup from '../compositions/ButtonGroup'; 
import MoreDetailsDrawer from '../compositions/MoreDetailsDrawer';
import SideDrawerLeft from '../compositions/SideDrawer';

describe('PHAButtonGroup component tests', () => {
  test('renders child components with correct styles', () => { 
    render(<PHAButtonGroup/>);

    expect(screen.getByRole('group')).toBeInTheDocument();
    const localFileButton = screen.getByRole('button', { name: /local file/i });
    expect(localFileButton).toBeInTheDocument();
    expect(localFileButton).toHaveClass('selectedButton');
    expect(screen.getByRole('button', { name: /upload local json file/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /url/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /transaction id/i })).toBeInTheDocument();
    
  });

  test('renders Github upload options on button click and update group button styles', () => { 
    render(<PHAButtonGroup/>);

    const urlButton = screen.getByRole('button', { name: /url/i });
    fireEvent.click(urlButton);

    expect(urlButton).toHaveClass('selectedButton');
    expect(screen.getByLabelText(/GitHub Repository/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Fetch Values from Github/i })).toBeInTheDocument();
    
  });

  test('renders transactionId upload options on button click and update group button styles', () => { 
    render(<PHAButtonGroup/>);

    const txIdButton = screen.getByRole('button', { name: /transaction id/i });
    fireEvent.click(txIdButton);

    expect(txIdButton).toHaveClass('selectedButton');
    expect(screen.getByLabelText(/Transaction ID/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Fetch Values from TransactionID/i })).toBeInTheDocument();
    
  });

  test('file upload function is called and works as expected', () => { 
    const updateValuesFromFile = jest.fn();

    useStore.setState({
        updateValuesFromFile,
    });

    render(<PHAButtonGroup/>);

    const localFileButton = screen.getByRole('button', { name: /Upload local JSON file/i });
    fireEvent.click(localFileButton);

    const mockFile = new File([JSON.stringify(mockUpdateJsonState)], 'test.json', { type: 'application/json' });
    const reader = new FileReader();
    jest.spyOn(window, 'FileReader').mockImplementation(() => reader);

    const fileInput = screen.getByLabelText(/file/i); 
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    if (reader.onload) {
        const fileReaderEvent = new Event('load');
        Object.defineProperty(fileReaderEvent, 'target', { value: { result: JSON.stringify(mockUpdateJsonState) }, writable: false });
        reader.onload(fileReaderEvent as ProgressEvent<FileReader>);
    }

    expect(updateValuesFromFile).toHaveBeenCalledTimes(1);
    expect(updateValuesFromFile).toHaveBeenCalledWith(mockUpdateJsonState);
  });

  test('url upload function is called and works as expected', async () => { 
    const updateValuesFromURL = jest.fn();

    useStore.setState({
        updateValuesFromURL,
    });

    render(<PHAButtonGroup/>);

    const urlButton = screen.getByRole('button', { name: /url/i });
    fireEvent.click(urlButton);

    const urlInput = screen.getByLabelText(/GitHub Repository/i);
    fireEvent.change(urlInput, { target: { value: 'https://github.com/user/repo' } });

    const fetchButton = screen.getByRole('button', { name: /fetch values from github/i });
    fireEvent.click(fetchButton);

    
    expect(updateValuesFromURL).toHaveBeenCalledTimes(1);
    await waitFor(() => {
        expect(updateValuesFromURL).toHaveBeenCalledWith(JSON.stringify('https://github.com/user/repo'));
    });
  });

  test('transactionId upload function is called and works as expected', async () => { 
    const updateValuesFromTxID  = jest.fn();

    useStore.setState({
        updateValuesFromTxID ,
    });

    render(<PHAButtonGroup/>);

    const txIdButton  = screen.getByRole('button', { name: /transaction id/i });
    fireEvent.click(txIdButton );

    const txIdInput  = screen.getByLabelText(/Transaction ID/i);
    fireEvent.change(txIdInput , { target: { value: '1234567890abcdef' } });

    const fetchButton = screen.getByRole('button', { name: /Fetch Values from TransactionID/i });
    fireEvent.click(fetchButton);

    expect(updateValuesFromTxID ).toHaveBeenCalledTimes(1);
    await waitFor(() => {
        expect(updateValuesFromTxID ).toHaveBeenCalledWith('1234567890abcdef');
    });
  });
});


describe('MoreDetailsDrawer component tests', () => {
    beforeEach(() => {
      useStore.setState({
        drawerOpen: true,
        selectedRowName: ['txFeePerByte'],
        currentTab: 'Proposal Parameters',
      });
    });
  
    test('renders correctly with child components', () => {
        render(<MoreDetailsDrawer />);
        
        expect(screen.getByRole('presentation')).toBeInTheDocument();
        expect(screen.getByRole('toolbar')).toBeInTheDocument();
        expect(screen.getByRole('presentation')).toContainElement(screen.getByText(/txFeePerByte Details/));
        expect(screen.getByTestId('CloseIcon')).toBeInTheDocument();
    });

    test('close drawer', async () => {
        render(<MoreDetailsDrawer />);

        const paper = screen.getByRole('dialog');
        expect(paper).toBeInTheDocument();
            
        const closeIcon = screen.getByTestId('CloseIcon');
        fireEvent.click(closeIcon);

        useStore.setState({ drawerOpen: false });
        await waitFor(() => {
            expect(paper).toHaveStyle('visibility: hidden');
        });   
    });

    test('open drawer', async () => {
        render(<MoreDetailsDrawer />);

        const paper = screen.getByRole('dialog');           

        useStore.setState({ drawerOpen: true });
        await waitFor(() => {
            expect(paper).toHaveStyle('visibility: visible');
        }); 
    });

    test('render Proposal Parameters details for txFeePerByte', () => {
        useStore.setState({
            validationResults: mockValidationResult
        });

        render(<MoreDetailsDrawer />);
        
        expect(screen.getByText('TFGEN-01')).toBeInTheDocument();
        expect(screen.getByText('TFGEN-01 is null')).toBeInTheDocument();
        expect(screen.getByText('TFGEN-02')).toBeInTheDocument();
        expect(screen.getByText('TFPB-01')).toBeInTheDocument();
        expect(screen.getByText('TFPB-01')).toHaveClass('MuiTypography-successText');
        expect(screen.getByText('TFPB-01 is passing')).toBeInTheDocument();
        expect(screen.getByText('TFPB-02')).toBeInTheDocument();
        expect(screen.getByText('TFPB-02')).toHaveClass('MuiTypography-errorText');
        expect(screen.getByText('TFPB-02 is mandatory and failing')).toBeInTheDocument();
        expect(screen.getByText('TFPB-03')).toBeInTheDocument();
        expect(screen.getByText('TFPB-03')).toHaveClass('MuiTypography-warningText');
        expect(screen.getByText('TFPB-03 is not mandatory and failing')).toBeInTheDocument();
      });

      test('render Guardrails details for TFPB-01', () => {
        useStore.setState({
          currentTab: 'Guardrails',
          selectedRowName: ['TFPB-01', 'txFeePerByte'],
        });
    
        render(<MoreDetailsDrawer />);
        
        expect(screen.getByText('TFPB-01')).toBeInTheDocument();
        expect(screen.getByText('TFPB-01')).toHaveClass('MuiTypography-successText');
        expect(screen.getByText('TFPB-01 is passing')).toBeInTheDocument();
      });

      test('displays error message when validationResults is null', () => {
        useStore.setState({
            validationResults: undefined,
        });
    
        render(<MoreDetailsDrawer />);
        
        expect(screen.getByText('No details available')).toBeInTheDocument(); 
      });

      test('displays error message when selectedRowName is null', () => {
        useStore.setState({
            selectedRowName: [],
        });

        render(<MoreDetailsDrawer />);

        expect(screen.getByText(/No details available/i)).toBeInTheDocument(); 
    });
  });



describe('SideDrawerLeft component tests', () => {
    beforeEach(() => {
      useStore.setState({
        initialJsonState: mockInitialJsonState, 
        validationResults: mockValidationResult,
      });
    }); 
  
    test('renders correctly with child components', () => {
      render(<SideDrawerLeft />);
  
      expect(screen.getByRole('presentation')).toBeInTheDocument();
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
      expect(screen.getByText('Proposal Parameter Checker')).toBeInTheDocument();
      expect(screen.getByText('Import Parameters')).toBeInTheDocument();
      expect(screen.getByText('Change Parameter Value')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /run/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/txFeePerByte/i)).toBeInTheDocument();
    });

    test('resets form to correct default values when loadApp and initialJsonState are reset', async () => {
        await act(async () => { 
          useStore.setState({
            loadApp: true,
            initialJsonState: mockUpdateJsonState,
          });
        });
    
        render(<SideDrawerLeft />);
    
        await waitFor(() => {
          expect(useStore.getState().loadApp).toBe(false);
        });
    
        //check values in updated mock data have replaced initial mock data
        expect(screen.getByDisplayValue(22)).toBeInTheDocument();
        expect(screen.getByDisplayValue(8976)).toBeInTheDocument();
      });

      test('calls handleRunCheck when Run button is clicked and posts the correct data', async () => {
        const postParametersProposal = jest.fn();

        useStore.setState({
            postParametersProposal,
          });

        render(<SideDrawerLeft />);
    
        const runButton = screen.getByText('Run');
        fireEvent.click(runButton);
        
        expect(postParametersProposal).toHaveBeenCalledTimes(1);
      });

      test('form value update changes currentJsonState', async () => {
        const updateCurrentJsonFieldState = jest.fn();

        useStore.setState({
            initialJsonState: mockInitialJsonState,
            updateCurrentJsonFieldState,
        });

        render(<SideDrawerLeft />);

        const inputField = screen.getByLabelText(/txFeePerByte/i);
        fireEvent.change(inputField, { target: { value: '88' } });
    
        expect(useStore.getState().updateCurrentJsonFieldState).toHaveBeenCalledWith('txFeePerByte', '88');
      });
  });
