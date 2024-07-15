import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { FieldType, Field } from "../components/InputGroup";
import * as Schema from "./schemas";

import type { AnySchema, AnyObjectSchema } from "yup";
import { FieldValues, Resolver } from "react-hook-form";

const getFieldSchema = (fieldType: FieldType, required: boolean): AnySchema => {
  let schema: yup.StringSchema | yup.NumberSchema = Schema.Text;
  switch (fieldType) {
    case FieldType.Rational: schema = Schema.Rational; break;
    case FieldType.Number: schema = Schema.Number; break;
  }
  return !required ? schema : schema.required('The field is required');
};

const buildSchema = (fields: Field[]): AnyObjectSchema => {
  const schema = {} as {[key: string]: AnySchema};
  for (const field of fields) {
    if (field.type === FieldType.Object) {
      schema[field.name] = buildSchema(field.fields || []);
    } else if (field.type === FieldType.Array) {
      schema[field.name] = yup.array().of(buildSchema(field.fields || []));
    } else {
      schema[field.name] = getFieldSchema(field.type, field.required !== undefined ? field.required : false);
    }
  }
  return yup.object().shape(schema);
};

export function buildFormResolver<T extends FieldValues = any>(fields: Field[]): Resolver<T> {
  return yupResolver(buildSchema(fields)) as Resolver<T>;
}