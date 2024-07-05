import * as yup from "yup";

export const Text = yup.string();

export const Rational = yup.string();

export const Number = yup.number()
  .min(0, "The field value must be a valid number greater than 0");