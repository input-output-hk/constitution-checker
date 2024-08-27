import { Resolver } from "react-hook-form";
import { Field, FieldType } from "../compositions/InputGroup";
import { buildFormResolver } from "../utils/form";

import type { ProposalForm } from "../store/types";

export const baseFormFields: Field[] = [
  {
    label: 'txFeePerByte',
    name: 'txFeePerByte',
    type: FieldType.Number,
    required: true,
  },{
    label: 'txFeeFixed',
    name: 'txFeeFixed',
    type: FieldType.Number,
    required: true,
  },{
    label: 'maxBlockBodySize',
    name: 'maxBlockBodySize',
    type: FieldType.Number,
    required: true,
  },{
    label: 'maxTxSize',
    name: 'maxTxSize',
    type: FieldType.Number,
    required: true,
  },{
    label: 'maxBlockHeaderSize',
    name: 'maxBlockHeaderSize',
    type: FieldType.Number,
    required: true,
  },{
    label: 'stakeAddressDeposit',
    name: 'stakeAddressDeposit',
    type: FieldType.Number,
    required: true,
  },{
    label: 'stakePoolDeposit',
    name: 'stakePoolDeposit',
    type: FieldType.Number,
    required: true,
  },{
    label: 'poolRetireMaxEpoch',
    name: 'poolRetireMaxEpoch',
    type: FieldType.Number,
    required: true,
  },{
    label: 'stakePoolTargetNum',
    name: 'stakePoolTargetNum',
    type: FieldType.Number,
    required: true,
  },{
    label: 'poolPledgeInfluence',
    name: 'poolPledgeInfluence',
    type: FieldType.Rational,
    required: true,
  },{
    label: 'monetaryExpansion',
    name: 'monetaryExpansion',
    type: FieldType.Rational,
    required: true,
  },{
    label: 'treasuryCut',
    name: 'treasuryCut',
    type: FieldType.Rational,
    required: true,
  },{
    label: 'minPoolCost',
    name: 'minPoolCost',
    type: FieldType.Number,
    required: true,
  },{
    label: 'utxoCostPerByte',
    name: 'utxoCostPerByte',
    type: FieldType.Number,
    required: true,
  },{
    label: 'maxValueSize',
    name: 'maxValueSize',
    type: FieldType.Number,
    required: true,
  },{
    label: 'collateralPercentage',
    name: 'collateralPercentage',
    type: FieldType.Number,
    required: true,
  },{
    label: 'maxCollateralInputs',
    name: 'maxCollateralInputs',
    type: FieldType.Number,
    required: true,
  },{
    label: 'committeeMinSize',
    name: 'committeeMinSize',
    type: FieldType.Number,
    required: true,
  },{
    label: 'committeeMaxTermLimit',
    name: 'committeeMaxTermLimit',
    type: FieldType.Number,
    required: true,
  },{
    label: 'govActionLifetime',
    name: 'govActionLifetime',
    type: FieldType.Number,
    required: true,
  },{
    label: 'govDeposit',
    name: 'govDeposit',
    type: FieldType.Number,
    required: true,
  },{
    label: 'dRepDeposit',
    name: 'dRepDeposit',
    type: FieldType.Number,
    required: true,
  },{
    label: 'dRepActivity',
    name: 'dRepActivity',
    type: FieldType.Number,
    required: true,
  },{
    label: 'minFeeRefScriptCoinsPerByte',
    name: 'minFeeRefScriptCoinsPerByte',
    type: FieldType.Number,
    required: true,
  },
];

const internalExecutionUnitPricesFields: Field[] = [
  {
    label: 'priceMemory',
    name: 'priceMemory',
    type: FieldType.Number,
    required: true,
  },{
    label: 'priceSteps',
    name: 'priceSteps',
    type: FieldType.Number,
    required: true,
  },
];

const internalMaxTxExecutionUnitsFields: Field[] = [
  {
    label: 'mem',
    name: 'mem',
    type: FieldType.Number,
    required: true,
  },{
    label: 'steps',
    name: 'steps',
    type: FieldType.Number,
    required: true,
  },
];

const internalMaxBlockExecutionUnitsFields: Field[] = [
  {
    label: 'memory',
    name: 'memory',
    type: FieldType.Rational,
    required: true,
  },{
    label: 'steps',
    name: 'steps',
    type: FieldType.Rational,
    required: true,
  },
];

const internalPoolVotingThresholdsFields: Field[] = [
  {
    label: 'committeeNoConfidence',
    name: 'committeeNoConfidence',
    type: FieldType.Rational,
    required: true,
  },{
    label: 'committeeNormal',
    name: 'committeeNormal',
    type: FieldType.Rational,
    required: true,
  },{
    label: 'hardForkInitiation',
    name: 'hardForkInitiation',
    type: FieldType.Rational,
    required: true,
  },{
    label: 'motionNoConfidence',
    name: 'motionNoConfidence',
    type: FieldType.Rational,
    required: true,
  },{
    label: 'ppSecurityGroup',
    name: 'ppSecurityGroup',
    type: FieldType.Rational,
    required: true,
  },
];

const internalDRepVotingThresholdsFields: Field[] = [
  {
    label: 'committeeNoConfidence',
    name: 'committeeNoConfidence',
    type: FieldType.Rational,
    required: true,
  },{
    label: 'committeeNormal',
    name: 'committeeNormal',
    type: FieldType.Rational,
    required: true,
  },{
    label: 'hardForkInitiation',
    name: 'hardForkInitiation',
    type: FieldType.Rational,
    required: true,
  },{
    label: 'motionNoConfidence',
    name: 'motionNoConfidence',
    type: FieldType.Rational,
    required: true,
  },{
    label: 'ppEconomicGroup',
    name: 'ppEconomicGroup',
    type: FieldType.Rational,
    required: true,
  },{
    label: 'ppGovernanceGroup',
    name: 'ppGovernanceGroup',
    type: FieldType.Rational,
    required: true,
  },{
    label: 'ppNetworkGroup',
    name: 'ppNetworkGroup',
    type: FieldType.Rational,
    required: true,
  },{
    label: 'ppTechnicalGroup',
    name: 'ppTechnicalGroup',
    type: FieldType.Rational,
    required: true,
  },{
    label: 'treasuryWithdrawal',
    name: 'treasuryWithdrawal',
    type: FieldType.Rational,
    required: true,
  },{
    label: 'updateConstitution',
    name: 'updateConstitution',
    type: FieldType.Rational,
    required: true,
  },
];

export const executionUnitPricesFields = internalExecutionUnitPricesFields.map(field => ({ ...field, name: `executionUnitPrices.${field.name}` }));
export const maxTxExecutionUnitsFields = internalMaxTxExecutionUnitsFields.map(field => ({ ...field, name: `maxTxExecutionUnits.${field.name}` }));
export const maxBlockExecutionUnitsFields = internalMaxBlockExecutionUnitsFields.map(field => ({ ...field, name: `maxBlockExecutionUnits.${field.name}` }));
export const poolVotingThresholdsFields = internalPoolVotingThresholdsFields.map(field => ({ ...field, name: `poolVotingThresholds.${field.name}` }));
export const dRepVotingThresholdsFields = internalDRepVotingThresholdsFields.map(field => ({ ...field, name: `dRepVotingThresholds.${field.name}` }));

export const resolver: Resolver<ProposalForm> = buildFormResolver<ProposalForm>([
  ...baseFormFields,
  {
    name: 'executionUnitPrices',
    type: FieldType.Object,
    fields: internalExecutionUnitPricesFields,
  },
  {
    name: 'maxTxExecutionUnits',
    type: FieldType.Object,
    fields: internalMaxTxExecutionUnitsFields,
  },
  {
    name: 'maxBlockExecutionUnits',
    type: FieldType.Object,
    fields: internalMaxBlockExecutionUnitsFields,
  },
  {
    name: 'poolVotingThresholds',
    type: FieldType.Object,
    fields: internalPoolVotingThresholdsFields,
  },
  {
    name: 'dRepVotingThresholds',
    type: FieldType.Object,
    fields: internalDRepVotingThresholdsFields,
  },
]);
