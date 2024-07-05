import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Typography, Button, Toolbar, Drawer, Box } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';

import IconButton from './IconButton';
import ButtonGroup from './ButtonGroup';
import CommonButton from './CommonButton';
import InputGroup from './InputGroup';

import useStore from '../store/store';
import { fields, resolver, mapJsonStateToForm, Form } from '../utils/sideDrawer';

export default function SideDrawerLeft() {
  const { initialJsonState, currentJsonState, validationResults, setCurrentJsonState, postParametersProposal, markFieldAsUnchecked } = useStore(state => ({
    initialJsonState: state.initialJsonState,
    currentJsonState: state.currentJsonState,
    validationResults: state.validationResults,
    setCurrentJsonState: state.setCurrentJsonState,
    postParametersProposal: state.postParametersProposal,
    markFieldAsUnchecked: state.markFieldAsUnchecked,
  }));

  const defaultValues = initialJsonState ? mapJsonStateToForm(initialJsonState) : undefined;
  const { register, formState, getFieldState, getValues, setValue, watch } = useForm<Form>({ defaultValues, resolver, mode: 'onChange' });

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      console.log(values, name);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const getErrorStatus = (paramName: string) => {
    if (!validationResults) return false;

    const selectedTBArray = paramName.split(/[.[\]]+/).filter(k => k);
    let tBDetails: any = validationResults;

    // Navigate through the nested structure
    for (const key of selectedTBArray) {
      if (tBDetails[key]) {
        tBDetails = tBDetails[key];
      } else {
        return false; // If any key is not found, return false
      }
    }

    return tBDetails?.summary === false;
  };

  const handleInputChange = (
    key: string,
    value: number | number[] | { [key: string]: number } | { [key: string]: number[] }
  ) => {
    if (currentJsonState) {
      const updatedJsonState = {
        ...currentJsonState,
        [key]: value,
      };
      setCurrentJsonState(updatedJsonState);
      markFieldAsUnchecked(key);
    }
  };

  const handleRunCheck = () => {
    if (currentJsonState) {
      postParametersProposal(currentJsonState);
    }
  };

  const buttons = [
    { label: 'Local File', onClick: () => console.log('Local File clicked') },
    { label: 'URL', onClick: () => console.log('URL clicked') },
    { label: 'Transaction ID', onClick: () => console.log('Transaction ID clicked') },
    { label: 'Start New', onClick: () => console.log('Start New') },
  ];

  return (
    <div className="perDrawerContainer">
      <Drawer
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
            <Typography variant={'h5'}>
              Proposal Parameter Checker
            </Typography>
        </Toolbar>
        
          <div className="child1DrawerContainer">
            <Box className="spBtwnDiv">
              <Typography variant={'h6'}>
                Import Parameters
              </Typography>
              <IconButton icon={<RefreshIcon />} />
            </Box>
            <ButtonGroup buttons={buttons} />
            <CommonButton fullWidth={true} text="Load Current Cardano State" startIcon={<DownloadIcon />}/>
          </div>

          <div className="child2DrawerContainer">
            <Box className="spBtwnDiv" >
              <Typography variant={'h6'}>
                  Change Parameter Value
              </Typography>
              <Button color='primary' variant='text' disableRipple disableFocusRipple onClick={handleRunCheck}>Run</Button>
            </Box>

            <div className="scrollBar">
              <InputGroup
                fields={fields}
                formState={formState}
                register={register}
                getFieldState={getFieldState}
                getValues={getValues}
                setValue={setValue}
              />
            </div>
          </div>
        
      </Drawer>
    </div>
  );
}
