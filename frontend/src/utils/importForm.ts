import { Resolver } from "react-hook-form";
import { Field, FieldType } from "../components/InputGroup";
import { buildFormResolver } from "../utils/form";

export const UrlField = {
  label: 'GitHub Repository',
  tooltip: 'URL entered should be in the format - https://github.com/<username>/<repository> (with an optional trailing backslash).',
  name: 'url',
  type: FieldType.GitHubRepository,
};

export const TransactionIDField = {
  label: 'Transaction ID',
  tooltip: 'Enter in the transaction ID',
  name: 'transactionId',
  type: FieldType.TransactionID,
};

export const resolver: Resolver<Field> = buildFormResolver<Field>([
    UrlField, TransactionIDField
  ]);