//React Imports
import { useEffect } from "react";

//React form Imports
import { useForm } from "react-hook-form";

//Mui imports
import { styled } from "@mui/material/styles";
import { Typography, Button, Toolbar, Drawer } from "@mui/material";

//Store imports
import { useShallow } from 'zustand/react/shallow';
import useStore from "../store/store";
import {
  mapInitialJsonStateToProposalForm,
  mapProposalFormToProposalValues,
} from "../store/mapper";
import type { ProposalForm } from "../store/types";

//local components
import MenuButton from "../components/MenuButton";
import ButtonGroup from "./ButtonGroup";
import InputGroup from "./InputGroup";

import {
  baseFormFields,
  executionUnitPricesFields,
  maxTxExecutionUnitsFields,
  maxBlockExecutionUnitsFields,
  poolVotingThresholdsFields,
  dRepVotingThresholdsFields,
  resolver,
} from '../utils/proposalForm';

const ScrollBar = styled("div", {
  name: "MuiScrollBar",
  slot: 'Root',
})``;

const SpBtwn = styled("div", {
  name: "MuiSpBtwn",
  slot: 'Root',
})``;

const ChildContain1 = styled("div", {
  name: "MuiChildContain1",
  slot: 'Root',
})``;

const ChildContain2 = styled("div", {
  name: "MuiChildContain2",
  slot: 'Root',
})``;

const PerContain = styled("div", {
  name: "MuiPerContain",
  slot: 'Root',
})``;

export default function SideDrawerLeft() {
  const { resetForm, initialJsonState, validationResults, postParametersProposal, updateCurrentJsonFieldState } = useStore(useShallow(state => ({
    resetForm: state.resetForm,
    initialJsonState: state.initialJsonState,
    validationResults: state.validationResults,
    postParametersProposal: state.postParametersProposal,
    updateCurrentJsonFieldState: state.updateCurrentJsonFieldState
  })));

  const defaultValues = initialJsonState ? mapInitialJsonStateToProposalForm(initialJsonState) : undefined;
  const { register, formState, getFieldState, getValues, setValue, watch, reset } = useForm<ProposalForm>({ defaultValues, resolver, mode: 'onChange' });

  useEffect(() => {
    if (resetForm && initialJsonState) {
      const newDefaultValues = mapInitialJsonStateToProposalForm(initialJsonState);
      reset(newDefaultValues);
      useStore.setState({ resetForm: false }); 
    }
  }, [resetForm, initialJsonState, reset]);

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
    if (value) return !value.summaryMandatory;
    return false;
  };

  const handleRunCheck = () => {
    postParametersProposal({
      ...initialJsonState,
      ...mapProposalFormToProposalValues(getValues()),
    });
  };

  return (
    <PerContain>
      <Drawer
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
            <Typography variant={'h5'}>
              Proposal Parameter Checker
            </Typography>
        </Toolbar>
        
          <ChildContain1>
            <SpBtwn>
              <Typography variant={'h6'}>
                Import Parameters
              </Typography>
              <MenuButton />
            </SpBtwn>
            <ButtonGroup />
            
          </ChildContain1>

          <ChildContain2>
            <SpBtwn>
              <Typography variant={'h6'}>
                Change Parameter Value
              </Typography>
              <Button color='primary' variant='text' disableRipple disableFocusRipple onClick={handleRunCheck}>Run</Button>
            </SpBtwn>

            <ScrollBar>
              <InputGroup
                fields={baseFormFields}
                formState={formState}
                register={register}
                getFieldState={getFieldState}
                getValues={getValues}
                setValue={setValue}
                getError={getError}
              />
              <Typography variant={'body1'}>
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
              <Typography variant={'body1'}>
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
              <Typography variant={'body1'}>
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
              <Typography variant={'body1'}>
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
              <Typography variant={'body1'}>
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
            </ScrollBar>
          </ChildContain2>
        
      </Drawer>
    </PerContain>
  );
}
