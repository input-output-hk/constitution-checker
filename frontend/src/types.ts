
export type InitialJsonState = {
  0: number,
  1: number,
  2: number,
  3: number,
  4: number,
  5: number,
  6: number,
  7: number,
  8: number,
  9: [number, number],
  10: [number, number],
  11: [number, number],
  16: number,
  17: number,
  19: {
    priceMemory: [number, number],
    priceSteps: [number, number],
  },
  20: {
    mem: number,
    steps: number,
  },
  21: {
    memory: number,
    steps: number,
  },
  22: number,
  23: number,
  24: number,
  25: {
    committeeNoConfidence: [number, number],
    committeeNormal: [number, number],
    hardForkInitiation: [number, number],
    motionNoConfidence: [number, number],
    ppSecurityGroup: [number, number],
  },
  26: {
    committeeNoConfidence: [number, number],
    committeeNormal: [number, number],
    hardForkInitiation: [number, number],
    motionNoConfidence: [number, number],
    ppEconomicGroup: [number, number],
    ppGovernanceGroup: [number, number],
    ppNetworkGroup: [number, number],
    ppTechnicalGroup: [number, number],
    treasuryWithdrawal: [number, number],
    updateConstitution: [number, number],
  },
  27: number,
  28: number,
  29: number,
  30: number,
  31: number,
  32: number,
  33: number,
};

export type ProposalValues = InitialJsonState;

export type CurrentFieldState = {
  value: string;
  checkStatus: 'checked' | 'unchecked';
}

export type CurrentJsonState = {
  txFeePerByte: CurrentFieldState;
  txFeeFixed: CurrentFieldState;
  maxBlockBodySize: CurrentFieldState;
  maxTxSize: CurrentFieldState;
  maxBlockHeaderSize: CurrentFieldState;
  stakeAddressDeposit: CurrentFieldState;
  stakePoolDeposit: CurrentFieldState;
  poolRetireMaxEpoch: CurrentFieldState;
  stakePoolTargetNum: CurrentFieldState;
  poolPledgeInfluence: CurrentFieldState;
  monetaryExpansion: CurrentFieldState;
  treasuryCut: CurrentFieldState;
  minPoolCost: CurrentFieldState;
  utxoCostPerByte: CurrentFieldState;
  maxValueSize: CurrentFieldState;
  collateralPercentage: CurrentFieldState;
  maxCollateralInputs: CurrentFieldState;
  committeeMinSize: CurrentFieldState;
  committeeMaxTermLimit: CurrentFieldState;
  govActionLifetime: CurrentFieldState;
  govDeposit: CurrentFieldState;
  dRepDeposit: CurrentFieldState;
  dRepActivity: CurrentFieldState;
  minFeeRefScriptCoinsPerByte: CurrentFieldState;
  executionUnitPrices: {
    priceMemory: CurrentFieldState;
    priceSteps: CurrentFieldState;
  };
  maxTxExecutionUnits: {
    mem: CurrentFieldState;
    steps: CurrentFieldState;
  };
  maxBlockExecutionUnits: {
    memory: CurrentFieldState;
    steps: CurrentFieldState;
  };
  poolVotingThresholds: {
    committeeNoConfidence: CurrentFieldState;
    committeeNormal: CurrentFieldState;
    hardForkInitiation: CurrentFieldState;
    motionNoConfidence: CurrentFieldState;
    ppSecurityGroup: CurrentFieldState;
  };
  dRepVotingThresholds: {
    committeeNoConfidence: CurrentFieldState;
    committeeNormal: CurrentFieldState;
    hardForkInitiation: CurrentFieldState;
    motionNoConfidence: CurrentFieldState;
    ppEconomicGroup: CurrentFieldState;
    ppGovernanceGroup: CurrentFieldState;
    ppNetworkGroup: CurrentFieldState;
    ppTechnicalGroup: CurrentFieldState;
    treasuryWithdrawal: CurrentFieldState;
    updateConstitution: CurrentFieldState;
  };
};

export type importForm = {
  url: string,
  transactionID: string
}

export type ProposalForm = {
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
  executionUnitPrices: {
    priceMemory: string;
    priceSteps: string;
  };
  maxTxExecutionUnits: {
    mem: string;
    steps: string;
  };
  maxBlockExecutionUnits: {
    memory: string;
    steps: string;
  };
  poolVotingThresholds: {
    committeeNoConfidence: string;
    committeeNormal: string;
    hardForkInitiation: string;
    motionNoConfidence: string;
    ppSecurityGroup: string;
  };
  dRepVotingThresholds: {
    committeeNoConfidence: string;
    committeeNormal: string;
    hardForkInitiation: string;
    motionNoConfidence: string;
    ppEconomicGroup: string;
    ppGovernanceGroup: string;
    ppNetworkGroup: string;
    ppTechnicalGroup: string;
    treasuryWithdrawal: string;
    updateConstitution: string;
  };
};

export type GuardrailResult = {
  description: string;
  message: string | null;
  result: boolean | null;
  resultMandatory: boolean | null;
};

export type ParameterValidationResult = {
  guardrails: { [key: string]: GuardrailResult };
  summary: boolean;
  value: number | number[] | { [key: string]: number[] };
};

export type ValidationResult = {
  txFeePerByte: ParameterValidationResult;
  txFeeFixed: ParameterValidationResult;
  maxBlockBodySize: ParameterValidationResult;
  maxTxSize: ParameterValidationResult;
  maxBlockHeaderSize: ParameterValidationResult;
  stakeAddressDeposit: ParameterValidationResult;
  stakePoolDeposit: ParameterValidationResult;
  poolRetireMaxEpoch: ParameterValidationResult;
  stakePoolTargetNum: ParameterValidationResult;
  poolPledgeInfluence: ParameterValidationResult;
  monetaryExpansion: ParameterValidationResult;
  treasuryCut: ParameterValidationResult;
  minPoolCost: ParameterValidationResult;
  utxoCostPerByte: ParameterValidationResult;
  maxValueSize: ParameterValidationResult;
  collateralPercentage: ParameterValidationResult;
  maxCollateralInputs: ParameterValidationResult;
  committeeMinSize: ParameterValidationResult;
  committeeMaxTermLimit: ParameterValidationResult;
  govActionLifetime: ParameterValidationResult;
  govDeposit: ParameterValidationResult;
  dRepDeposit: ParameterValidationResult;
  dRepActivity: ParameterValidationResult;
  minFeeRefScriptCoinsPerByte: ParameterValidationResult;
  executionUnitPrices: {
    priceMemory: ParameterValidationResult;
    priceSteps: ParameterValidationResult;
  };
  maxTxExecutionUnits: {
    mem: ParameterValidationResult;
    steps: ParameterValidationResult;
  };
  maxBlockExecutionUnits: {
    memory: ParameterValidationResult;
    steps: ParameterValidationResult;
  };
  poolVotingThresholds: {
    committeeNoConfidence: ParameterValidationResult;
    committeeNormal: ParameterValidationResult;
    hardForkInitiation: ParameterValidationResult;
    motionNoConfidence: ParameterValidationResult;
    ppSecurityGroup: ParameterValidationResult;
  };
  dRepVotingThresholds: {
    committeeNoConfidence: ParameterValidationResult;
    committeeNormal: ParameterValidationResult;
    hardForkInitiation: ParameterValidationResult;
    motionNoConfidence: ParameterValidationResult;
    ppEconomicGroup: ParameterValidationResult;
    ppGovernanceGroup: ParameterValidationResult;
    ppNetworkGroup: ParameterValidationResult;
    ppTechnicalGroup: ParameterValidationResult;
    treasuryWithdrawal: ParameterValidationResult;
    updateConstitution: ParameterValidationResult;
  };
};