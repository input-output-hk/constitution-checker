import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Typography, Button, Toolbar, Drawer, Box } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";

import IconButton from "./IconButton";
import ButtonGroup from "./ButtonGroup";
import CommonButton from "./CommonButton";
import InputGroup from "./InputGroup";

import useStore from "../store";

import {
  mapInitialJsonStateToProposalForm,
  mapProposalFormToProposalValues,
} from "../utils/mapper";

import {
  baseFormFields,
  executionUnitPricesFields,
  maxTxExecutionUnitsFields,
  maxBlockExecutionUnitsFields,
  poolVotingThresholdsFields,
  dRepVotingThresholdsFields,
  resolver,
} from '../utils/proposalForm';

import type { ProposalForm } from "../types";

export default function SideDrawerLeft() {
  const { initialJsonState, validationResults, postParametersProposal, updateCurrentJsonFieldState } = useStore();

  const defaultValues = initialJsonState ? mapInitialJsonStateToProposalForm(initialJsonState) : undefined;
  const { register, formState, getFieldState, getValues, setValue, watch } = useForm<ProposalForm>({ defaultValues, resolver, mode: 'onChange' });

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (name) {
        const [level1, level2] = name.split('.');
        let value = (values as any)[level1];
        if (level2) value = value[level2];
        updateCurrentJsonFieldState(name, value);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const getError = (name: string): boolean => {
    const [level1, level2] = name.split('.');
    let value = (validationResults as any)[level1];
    if (level2) value = value[level2];
    if (value) return !value.summary;
    return false;
  };

  const handleRunCheck = () => {
    postParametersProposal({
      ...initialJsonState,
      ...mapProposalFormToProposalValues(getValues()),
    });
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
                fields={baseFormFields}
                formState={formState}
                register={register}
                getFieldState={getFieldState}
                getValues={getValues}
                setValue={setValue}
                getError={getError}
              />
              <Typography variant={'body1'} sx={{marginTop: '8px'}}>
                executionUnitPrices
              </Typography>
              <InputGroup
                fields={executionUnitPricesFields}
                formState={formState}
                register={register}
                getFieldState={getFieldState}
                getValues={getValues}
                setValue={setValue}
                getError={getError}
              />
              <Typography variant={'body1'} sx={{marginTop: '8px'}}>
                maxTxExecutionUnits
              </Typography>
              <InputGroup
                fields={maxTxExecutionUnitsFields}
                formState={formState}
                register={register}
                getFieldState={getFieldState}
                getValues={getValues}
                setValue={setValue}
                getError={getError}
              />
              <Typography variant={'body1'} sx={{marginTop: '8px'}}>
                maxBlockExecutionUnits
              </Typography>
              <InputGroup
                fields={maxBlockExecutionUnitsFields}
                formState={formState}
                register={register}
                getFieldState={getFieldState}
                getValues={getValues}
                setValue={setValue}
                getError={getError}
              />
              <Typography variant={'body1'} sx={{marginTop: '8px'}}>
                poolVotingThresholds
              </Typography>
              <InputGroup
                fields={poolVotingThresholdsFields}
                formState={formState}
                register={register}
                getFieldState={getFieldState}
                getValues={getValues}
                setValue={setValue}
                getError={getError}
              />
              <Typography variant={'body1'} sx={{marginTop: '8px'}}>
                dRepVotingThresholds
              </Typography>
              <InputGroup
                fields={dRepVotingThresholdsFields}
                formState={formState}
                register={register}
                getFieldState={getFieldState}
                getValues={getValues}
                setValue={setValue}
                getError={getError}
              />
            </div>
          </div>
        
      </Drawer>
    </div>
  );
}
