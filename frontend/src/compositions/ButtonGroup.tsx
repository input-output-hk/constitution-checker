//React Imports
import React, { useState } from 'react';

//React form Imports
import { useForm } from "react-hook-form";

//Mui imports
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import DownloadIcon from "@mui/icons-material/Download";
import GitHubIcon from '@mui/icons-material/GitHub';

//Store imports
import type { ImportForm } from "../store/types";
import useStore from "../store/store";

//local components
import CommonButton from "../components/CommonButton";
import Input from './InputGroup/Input';

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

  const { updateValuesFromFile, updateValuesFromURL, updateValuesFromTID } = useStore(state => ({
    updateValuesFromFile: state.updateValuesFromFile,
    updateValuesFromURL: state.updateValuesFromURL,
    updateValuesFromTID: state.updateValuesFromTID,
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
          updateValuesFromFile(json); 
          (event.target as HTMLInputElement).value = '';
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

 

  const handleURLUpload = () => {
  const url = getValues('url'); 
  updateValuesFromURL(JSON.stringify(url));
  }

  const handleTIDUpload = () => {
    updateValuesFromTID(getValues('transactionID'));
  }

  return (
    <>
    <ButtonGroup variant="outlined"  disableRipple fullWidth>
      {buttons.map((button, index) => (
        <Button
        key={index}
        onClick={handleButtonClick(index)}
        className={index === importOption ? 'selectedButton' : ''}
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
      />
      <CommonButton fullWidth={true} text="Fetch Values from Github" startIcon={<GitHubIcon />} onClick={handleURLUpload} />
    </>
      }
    {importOption === 2 && 
    <>
      <Input
          field={TransactionIDField}
          formState={formState}
          register={register}
          getFieldState={getFieldState}
          getValues={getValues}
          setValue={setValue}
        />
        <CommonButton fullWidth={true} text="Fetch Values from TransactionID" startIcon={<DownloadIcon />} onClick={handleTIDUpload} />
      </>
      }
      
    </>
  );
}