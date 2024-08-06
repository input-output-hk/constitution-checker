import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import CommonButton from "./CommonButton";
import Input from './InputGroup/Input';
import type { ImportForm } from "../types";
import useStore from "../store";

import DownloadIcon from "@mui/icons-material/Download";
import GitHubIcon from '@mui/icons-material/GitHub';

import {
  UrlField,
  TransactionIDField,
  resolver,
} from '../utils/importForm';

const buttons = [
  'Local File' ,
  'URL',
  'Transaction ID',
];
  
export default function PHAButtonGroup() {
  const [importOption, setimportOption] = useState(0);

  const { updateInitialValues, updateValuesFromURL } = useStore(state => ({
    updateInitialValues: state.updateInitialValues,
    updateValuesFromURL: state.updateValuesFromURL,
  }));

  const { register, formState, getFieldState, getValues, setValue } = useForm<ImportForm>({ resolver, mode: 'onChange' });

  const handleButtonClick = (index: number) => {
    return () => {
      setimportOption(index);
    };
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          updateInitialValues(json); 
          (event.target as HTMLInputElement).value = '';
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  function getError() {
    return false;
  }

  const handleURLUpload = () => {
  const url = getValues('url'); 
  updateValuesFromURL(JSON.stringify(url));
  }

  return (
    <>
    <ButtonGroup variant="outlined"  disableRipple fullWidth>
      {buttons.map((button, index) => (
        <Button
        key={index}
        onClick={handleButtonClick(index)}
        sx={{ 
          backgroundColor: index === importOption ? 'rgba(57, 82, 205, 0.12)' : '#fff',
        }}
      >
        {button}
      </Button>
      ))}
    </ButtonGroup>
    {importOption === 0 && 
    <CommonButton fullWidth={true} text="Upload local JSON file" startIcon={<DownloadIcon />} onClick={() => document.getElementById('file-upload')?.click()}/>}
    <input
        type="file"
        accept=".json"
        id="file-upload"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    {importOption === 1 && 
    <> 
      <Input
        field={UrlField}
        formState={formState}
        register={register}
        getFieldState={getFieldState}
        getValues={getValues}
        setValue={setValue}
        getError={getError}
      />
      <CommonButton fullWidth={true} text="Fetch Values from Github" startIcon={<GitHubIcon />} onClick={handleURLUpload} />
    </>
      }
    {importOption === 2 && 
    <Input
        field={TransactionIDField}
        formState={formState}
        register={register}
        getFieldState={getFieldState}
        getValues={getValues}
        setValue={setValue}
        getError={getError}
      />}
    </>
  );
}