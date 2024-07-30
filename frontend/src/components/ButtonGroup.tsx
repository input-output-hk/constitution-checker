import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import CommonButton from "./CommonButton";
import Input from './InputGroup/Input';
import { Field } from "../components/InputGroup";
import useStore from "../store";

import DownloadIcon from "@mui/icons-material/Download";

import {
  UrlField,
  TransactionIDField,
  resolver,
} from '../utils/importForm';

interface ButtonInfo {
  label: string; 
}

interface PHAButtonGroupProps {
  buttons: ButtonInfo[];  
}

export default function PHAButtonGroup({ buttons }: PHAButtonGroupProps) {
  const { importOption, changeImportMethod, updateInitialJsonValue } = useStore(state => ({
    importOption: state.importOption,
    changeImportMethod: state.changeImportMethod,
    updateInitialJsonValue: state.updateInitialJsonValue,
  }));

  const { register, formState, getFieldState, getValues, setValue } = useForm<Field>({ resolver, mode: 'onChange' });

  const handleButtonClick = (index: number) => {
    return () => {
      changeImportMethod(index);
    };
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          updateInitialJsonValue(json); 
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
        {button.label}
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
    <Input
        field={UrlField}
        formState={formState}
        register={register}
        getFieldState={getFieldState}
        getValues={getValues}
        setValue={setValue}
        getError={getError}
      />}
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