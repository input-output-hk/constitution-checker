import Input from "./Input";

import type { UseFormRegister, UseFormGetFieldState, UseFormGetValues, UseFormSetValue, FormState, FieldValues } from "react-hook-form";

export enum FieldType {
  Text,
  Rational,
  Number,
  Object,
  Array
}

export interface Field {
  name: string;
  type: FieldType;
  label?: string;
  required?: boolean;
  fields?: Field[];
}

export interface InputGroupProps<T extends FieldValues = any> {
  fields: Field[];
  formState: FormState<T>;
  register: UseFormRegister<T>;
  getFieldState: UseFormGetFieldState<T>;
  getValues: UseFormGetValues<T>;
  setValue: UseFormSetValue<T>;
  getError: (field: string) => boolean;
}

export interface InputProps<T extends FieldValues = any> {
  field: Field;
  formState: FormState<T>;
  register: UseFormRegister<T>;
  getFieldState: UseFormGetFieldState<T>;
  getValues: UseFormGetValues<T>;
  setValue: UseFormSetValue<T>;
  getError: (field: string) => boolean;
}

const InputGroup = (props: InputGroupProps) => {
  return (
    <>
      {props.fields.map((field, index) => (
        <Input
          key={index}
          field={field}
          formState={props.formState}
          register={props.register}
          getFieldState={props.getFieldState}
          getValues={props.getValues}
          setValue={props.setValue}
          getError={props.getError}
        />
      ))}
    </>
  );
};

export default InputGroup;