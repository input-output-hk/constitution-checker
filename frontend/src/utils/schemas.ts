import * as yup from "yup";

export const Text = yup.string();

export const Rational = yup.string()
  .matches(/^[0-9]+\/[0-9]+$/, {
    message: 'The value must contain two numbers separated by a slash (/)',
    excludeEmptyString: true
  });

export const Number = yup.number()
  .min(0, "The field value must be a valid number greater than 0");

export const GitHubRepository = yup.string()
.matches(/^https:\/\/raw\.githubusercontent\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-\/]+\/[a-zA-Z0-9-]+\.[a-zA-Z0-9]+$/, {
  message: 'URL entered should be in the format - https://raw.githubusercontent.com/<username>/<filepath> .',
  excludeEmptyString: true 
});