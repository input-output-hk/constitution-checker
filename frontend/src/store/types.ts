export type GuardrailResult = {
    description: string;
    message: string | null;
    result: boolean | null;
};

export type ParameterValidationResult = {
    guardrails: { [key: string]: GuardrailResult };
    summary: boolean;
    value: number | number[] | { [key: string]: number[] };
};

export type ValidationResult = {
    "collateralPercentage": ParameterValidationResult,
    "committeeMaxTermLimit": ParameterValidationResult,
    "committeeMinSize": ParameterValidationResult,
    "dRepActivity": ParameterValidationResult,
    "dRepDeposit": ParameterValidationResult,
    "dRepVotingThresholds": {
    "committeeNoConfidence": ParameterValidationResult,
    "committeeNormal": ParameterValidationResult,
    "hardForkInitiation": ParameterValidationResult,
    "motionNoConfidence": ParameterValidationResult,
    "ppEconomicGroup": ParameterValidationResult,
    "ppGovernanceGroup": ParameterValidationResult,
    "ppNetworkGroup": ParameterValidationResult,
    "ppTechnicalGroup": ParameterValidationResult,
    "treasuryWithdrawal": ParameterValidationResult,
    "updateConstitution": ParameterValidationResult,
    "summary": boolean
  },
  "executionUnitPrices": {
    "priceMemory": ParameterValidationResult,
    "priceSteps": ParameterValidationResult,
    "summary": true
  },
  "govActionLifetime": ParameterValidationResult,
  "govDeposit": ParameterValidationResult,
  "maxBlockBodySize": ParameterValidationResult
  "maxBlockExecutionUnits": {
    "memory": ParameterValidationResult,
    "steps": ParameterValidationResult,
    "summary": false
  },
  "maxBlockHeaderSize": ParameterValidationResult,
  "maxCollateralInputs": ParameterValidationResult,
  "maxTxExecutionUnits": {
    "mem": ParameterValidationResult,
    "steps": ParameterValidationResult,
    "summary": true
  },
  "maxTxSize": ParameterValidationResult,
  "maxValueSize": ParameterValidationResult,
  "minFeeRefScriptCoinsPerByte": ParameterValidationResult,
  "minPoolCost": ParameterValidationResult,
  "missingParamCurrentValues": {},
  "monetaryExpansion": ParameterValidationResult,
  "poolPledgeInfluence": ParameterValidationResult,
  "poolRetireMaxEpoch": ParameterValidationResult,
  "poolVotingThresholds": {
    "committeeNoConfidence": ParameterValidationResult,
    "committeeNormal": ParameterValidationResult,
    "hardForkInitiation": ParameterValidationResult,
    "motionNoConfidence": ParameterValidationResult,
    "ppSecurityGroup": ParameterValidationResult,
    "summary": true
  },
  "stakeAddressDeposit": ParameterValidationResult,
  "stakePoolDeposit": ParameterValidationResult,
  "stakePoolTargetNum": ParameterValidationResult,
  "treasuryCut": ParameterValidationResult,
  "txFeeFixed": ParameterValidationResult,
  "txFeePerByte": ParameterValidationResult,
  "utxoCostPerByte": ParameterValidationResult
}

export type InitialJsonState = {
    "0": number,
    "1": number,
    "2": number,
    "3": number,
    "4": number,
    "5": number,
    "6": number,
    "7": number,
    "8": number,
    "9": [number, number],
    "10": [number, number],
    "11": [number, number],
    "16": number,
    "17": number,
    "18": {
        plutusV1: number[],
        plutusV2: number[],
        plutusV3: number[]
    },
    "19": {
        priceMemory: [number, number],
        priceSteps: [number, number]
    },
    "20": {
        mem: number,
        steps: number
    },
    "21": {
        memory: number,
        steps: number
    },
    "22": number,
    "23": number,
    "24": number,
    "25": {
        committeeNoConfidence: [number, number],
        committeeNormal: [number, number],
        hardForkInitiation: [number, number],
        motionNoConfidence: [number, number],
        ppSecurityGroup: [number, number]
    },
    "26": {
        committeeNoConfidence: [number, number],
        committeeNormal: [number, number],
        hardForkInitiation: [number, number],
        motionNoConfidence: [number, number],
        ppEconomicGroup: [number, number],
        ppGovernanceGroup: [number, number],
        ppNetworkGroup: [number, number],
        ppTechnicalGroup: [number, number],
        treasuryWithdrawal: [number, number],
        updateConstitution: [number, number]
    },
    "27": number,
    "28": number,
    "29": number,
    "30": number,
    "31": number,
    "32": number,
    "33": number,
};

export type CheckedStatus = {
    [key: string]: 'checked' | 'unchecked' | CheckedStatus;
};

export type State = {
    initialJsonState: InitialJsonState | undefined;
    currentJsonState: InitialJsonState | undefined;
    validationResults: ValidationResult | undefined;
    loading: boolean;
    error: null | string;
    checkedStatus: CheckedStatus;
    currentTab: string;
    drawerOpen: boolean;
    selectedRowName: string[];
};

export type Action = {
    fetchJsonInitialState: () => void;
    updateInitialJsonState: (json: InitialJsonState) => void;
    setCurrentJsonState: (json: InitialJsonState) => void;
    postParametersProposal: (data: InitialJsonState) => Promise<any>;
    revertToInitialJsonState: () => void;
    markFieldAsUnchecked: (key: string) => void;
    changeSelectedTab: (tabName: string) => void;
    toggleMoreDetailsDrawer: (value: boolean) => void;
    changeTableDetails: (rowName: string, parameterName?: string) => void;
};
