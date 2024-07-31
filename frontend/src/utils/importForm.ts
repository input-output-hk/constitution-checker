import { Resolver } from "react-hook-form";
import { FieldType } from "../components/InputGroup";
import { buildFormResolver } from "../utils/form";

import type { importForm } from "../types";

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

export const resolver: Resolver<importForm> = buildFormResolver<importForm>([
    UrlField, TransactionIDField
  ]);