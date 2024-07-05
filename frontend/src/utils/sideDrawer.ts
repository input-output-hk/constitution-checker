import { Resolver } from "react-hook-form";
import { Field, FieldType } from "../components/InputGroup";
import { buildFormResolver } from "../utils/form";
import { InitialJsonState } from "../store/types";

export interface Form {
  txFeePerByte: string;
  txFeeFixed: string;
  maxBlockBodySize: string;
  maxTxSize: string;
  maxBlockHeaderSize: string;
  stakeAddressDeposit: string;
  stakePoolDeposit: string;
  poolRetireMaxEpoch: string;
  stakePoolTargetNum: string;
  poolPledgeInfluence: string;
  monetaryExpansion: string;
  treasuryCut: string;
  minPoolCost: string;
  utxoCostPerByte: string;
  maxValueSize: string;
  collateralPercentage: string;
  maxCollateralInputs: string;
  committeeMinSize: string;
  committeeMaxTermLimit: string;
  govActionLifetime: string;
  govDeposit: string;
  dRepDeposit: string;
  dRepActivity: string;
  minFeeRefScriptCoinsPerByte: string;
  executionUnitPricesPriceMemory: string;
  executionUnitPricesPriceSteps: string;
  maxTxExecutionUnitsMemory: string;
  maxTxExecutionUnitsSteps: string;
  maxBlockExecutionUnitsMemory: string;
  maxBlockExecutionUnitsSteps: string;
}

export const mapJsonStateToForm = (initialJsonState: InitialJsonState): Form => ({
  txFeePerByte: initialJsonState[0].toString(),
  txFeeFixed: initialJsonState[1].toString(),
  maxBlockBodySize: initialJsonState[2].toString(),
  maxTxSize: initialJsonState[3].toString(),
  maxBlockHeaderSize: initialJsonState[4].toString(),
  stakeAddressDeposit: initialJsonState[5].toString(),
  stakePoolDeposit: initialJsonState[6].toString(),
  poolRetireMaxEpoch: initialJsonState[7].toString(),
  stakePoolTargetNum: initialJsonState[8].toString(),
  poolPledgeInfluence: `${initialJsonState[9][0]}/${initialJsonState[9][1]}`,
  monetaryExpansion: `${initialJsonState[10][0]}/${initialJsonState[10][1]}`,
  treasuryCut: `${initialJsonState[11][0]}/${initialJsonState[11][1]}`,
  minPoolCost: initialJsonState[16].toString(),
  utxoCostPerByte: initialJsonState[17].toString(),
  maxValueSize: initialJsonState[22].toString(),
  collateralPercentage: initialJsonState[23].toString(),
  maxCollateralInputs: initialJsonState[24].toString(),
  committeeMinSize: initialJsonState[27].toString(),
  committeeMaxTermLimit: initialJsonState[28].toString(),
  govActionLifetime: initialJsonState[29].toString(),
  govDeposit: initialJsonState[30].toString(),
  dRepDeposit: initialJsonState[31].toString(),
  dRepActivity: initialJsonState[32].toString(),
  minFeeRefScriptCoinsPerByte: initialJsonState[33].toString(),
  executionUnitPricesPriceMemory: `${initialJsonState[19].priceMemory[0]}/${initialJsonState[19].priceMemory[1]}`,
  executionUnitPricesPriceSteps: `${initialJsonState[19].priceSteps[0]}/${initialJsonState[19].priceSteps[1]}`,
  maxTxExecutionUnitsMemory: initialJsonState[20].mem.toString(),
  maxTxExecutionUnitsSteps: initialJsonState[20].steps.toString(),
  maxBlockExecutionUnitsMemory: initialJsonState[21].memory.toString(),
  maxBlockExecutionUnitsSteps: initialJsonState[21].steps.toString(),
});

export const fields: Field[] = [
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
  },{
    label: 'executionUnitPricesPriceMemory',
    name: 'executionUnitPricesPriceMemory',
    type: FieldType.Rational,
    required: true,
  },{
    label: 'executionUnitPricesPriceSteps',
    name: 'executionUnitPricesPriceSteps',
    type: FieldType.Rational,
    required: true,
  },{
    label: 'maxTxExecutionUnitsMemory',
    name: 'maxTxExecutionUnitsMemory',
    type: FieldType.Number,
    required: true,
  },{
    label: 'maxTxExecutionUnitsSteps',
    name: 'maxTxExecutionUnitsSteps',
    type: FieldType.Number,
    required: true,
  },{
    label: 'maxBlockExecutionUnitsMemory',
    name: 'maxBlockExecutionUnitsMemory',
    type: FieldType.Number,
    required: true,
  },{
    label: 'maxBlockExecutionUnitsSteps',
    name: 'maxBlockExecutionUnitsSteps',
    type: FieldType.Number,
    required: true,
  }
];

export const resolver: Resolver<Form> = buildFormResolver<Form>(fields);
