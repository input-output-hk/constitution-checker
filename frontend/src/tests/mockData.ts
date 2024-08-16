// local import
import type { InitialJsonState, ValidationResult } from '../store/types';

// mock data
export const mockInitialJsonState: InitialJsonState = {
  "0": 44,
  "1": 155381,
  "2": 90112,
  "3": 16384,
  "4": 1100,
  "5": 2000000,
  "6": 500000000,
  "7": 18,
  "8": 500,
  "9": [3, 10],
  "10": [3, 1000],
  "11": [1, 5],
  "16": 340000000,
  "17": 4310,
  "19": {
    "priceMemory": [577, 10000],
    "priceSteps": [721, 10000000],
  },
  "20": {
    "mem": 14000000,
    "steps": 10000000000,
  },
  "21": {
    "memory": 62000000,
    "steps": 20000000000,
  },
  "22": 5000,
  "23": 150,
  "24": 3,
  "25": {
    "committeeNoConfidence": [51, 100],
    "committeeNormal": [3, 5],
    "hardForkInitiation": [51, 100],
    "motionNoConfidence": [3, 5],
    "ppSecurityGroup": [-1, 1],
  },
  "26": {
    "committeeNoConfidence": [3, 5],
    "committeeNormal": [67, 100],
    "hardForkInitiation": [3, 5],
    "motionNoConfidence": [67, 100],
    "ppEconomicGroup": [67, 100],
    "ppGovernanceGroup": [3, 4],
    "ppNetworkGroup": [67, 100],
    "ppTechnicalGroup": [67, 100],
    "treasuryWithdrawal": [67, 100],
    "updateConstitution": [3, 4],
  },
  "27": 3,
  "28": 73,
  "29": 8,
  "30": 50000000000,
  "31": 500000000,
  "32": 20,
  "33": -1
};

export const mockUpdateJsonState: InitialJsonState = {
  "0": 22,
  "1": 155381,
  "2": 8,
  "3": 16384,
  "4": 1100,
  "5": 2000000,
  "6": 500000000,
  "7": 18,
  "8": 500,
  "9": [3, 10],
  "10": [3, 1000],
  "11": [1, 5],
  "16": 340000000,
  "17": 4310,
  "19": {
    "priceMemory": [577, 10000],
    "priceSteps": [721, 10000000],
  },
  "20": {
    "mem": 14000000,
    "steps": 10000000000,
  },
  "21": {
    "memory": 62000000,
    "steps": 20000000000,
  },
  "22": 5000,
  "23": 150,
  "24": 3,
  "25": {
    "committeeNoConfidence": [51, 100],
    "committeeNormal": [3, 5],
    "hardForkInitiation": [51, 100],
    "motionNoConfidence": [3, 5],
    "ppSecurityGroup": [-1, 1],
  },
  "26": {
    "committeeNoConfidence": [3, 5],
    "committeeNormal": [67, 100],
    "hardForkInitiation": [3, 5],
    "motionNoConfidence": [67, 100],
    "ppEconomicGroup": [67, 100],
    "ppGovernanceGroup": [3, 4],
    "ppNetworkGroup": [67, 100],
    "ppTechnicalGroup": [67, 100],
    "treasuryWithdrawal": [67, 100],
    "updateConstitution": [3, 4],
  },
  "27": 3,
  "28": 73,
  "29": 8,
  "30": 50000000000,
  "31": 500000000,
  "32": 20,
  "33": -1
};

export const validationResult: ValidationResult = {
  "collateralPercentage": {
    "guardrails": {
      "CP-01": {
        "description": "collateralPercentage must not be lower than 100",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "CP-02": {
        "description": "collateralPercentage must not exceed 200",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "CP-03": {
        "description": "collateralPercentage must not be negative",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "CP-04": {
        "description": "collateralPercentage must not be set to 0",
        "isMandatory": true,
        "message": null,
        "result": true
      }
    },
    "summary": true,
    "summaryMandatory": true,
    "value": 100
  },
  "committeeMaxTermLimit": {
    "guardrails": {
      "CMTL-01": {
        "description": "committeeMaxTermLimit must not be zero",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "CMTL-02": {
        "description": "committeeMaxTermLimit must not be negative",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "CMTL-03": {
        "description": "committeeMaxTermLimit must not be lower than 18 epochs (90 days, or approximately 3 months)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "CMTL-04": {
        "description": "committeeMaxTermLimit must not exceed 293 epochs (approximately 4 years)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "CMTL-05": {
        "description": "committeeMaxTermLimit should not exceed 220 epochs (approximately 3 years)",
        "isMandatory": false,
        "message": null,
        "result": true
      }
    },
    "summary": true,
    "summaryMandatory": true,
    "value": 18
  },
  "committeeMinSize": {
    "guardrails": {
      "CMS-01": {
        "description": "committeeMinSize must not be negative",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "CMS-02": {
        "description": "committeeMinSize must not be lower than 3",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "CMS-03": {
        "description": "committeeMinSize must not exceed 10",
        "isMandatory": true,
        "message": null,
        "result": true
      }
    },
    "summary": true,
    "summaryMandatory": true,
    "value": 3
  },
  "dRepActivity": {
    "guardrails": {
      "DRA-01": {
        "description": "dRepActivity must not be lower than 13 epochs (2 months)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "DRA-02": {
        "description": "dRepActivity must not exceed 37 epochs (6 months)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "DRA-03": {
        "description": "dRepActivity must not be negative",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "DRA-04": {
        "description": "dRepActivity must be greater than govActionLifetime",
        "isMandatory": false,
        "message": null,
        "result": true
      },
      "DRA-05": {
        "description": "dRepActivity should be calculated in human terms (2 months etc.)",
        "isMandatory": false,
        "message": "dRepActivity should be calculated in human terms (2 months etc.) but it is 65 days, which is 0 years, 2 months, 0 weeks, 5 days",
        "result": false
      }
    },
    "summary": false,
    "summaryMandatory": true,
    "value": 13
  },
  "dRepDeposit": {
    "guardrails": {
      "DRD-01": {
        "description": "dRepDeposit must not be negative",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "DRD-02": {
        "description": "dRepDeposit must not be lower than 1,000,000 (1 ada)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "DRD-03": {
        "description": "dRepDeposit must be no more than 100,000,000,000 (100,000 ada)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "DRD-04": {
        "description": "dRepDeposit should be adjusted in line with fiat changes",
        "isMandatory": false,
        "message": "Please contribute to this check.",
        "result": null
      }
    },
    "summary": true,
    "summaryMandatory": true,
    "value": 1000000
  },
  "dRepVotingThresholds": {
    "committeeNoConfidence": {
      "guardrails": {
        "VT-CC-01": {
          "description": "Update Constitutional Committee action thresholds must be in the range 51%-90%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-CC-01b": {
          "description": "Update Constitutional Committee action thresholds must be in the range 51%-90%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-01": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-01b": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        }
      },
      "summary": true,
      "summaryMandatory": true,
      "value": [
        51,
        100
      ]
    },
    "committeeNormal": {
      "guardrails": {
        "VT-CC-01": {
          "description": "Update Constitutional Committee action thresholds must be in the range 51%-90%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-CC-01b": {
          "description": "Update Constitutional Committee action thresholds must be in the range 51%-90%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-01": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-01b": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        }
      },
      "summary": true,
      "summaryMandatory": true,
      "value": [
        51,
        100
      ]
    },
    "hardForkInitiation": {
      "guardrails": {
        "VT-GEN-01": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-01b": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-HF-01": {
          "description": "Hard fork action thresholds must be in the range 51%-80%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-HF-01b": {
          "description": "Hard fork action thresholds must be in the range 51%-80%",
          "isMandatory": true,
          "message": null,
          "result": true
        }
      },
      "summary": true,
      "summaryMandatory": true,
      "value": [
        51,
        100
      ]
    },
    "motionNoConfidence": {
      "guardrails": {
        "VT-GEN-01": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-01b": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-NC-01": {
          "description": "No confidence action thresholds must be in the range 51%-75%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-NC-01b": {
          "description": "No confidence action thresholds must be in the range 51%-75%",
          "isMandatory": true,
          "message": null,
          "result": true
        }
      },
      "summary": true,
      "summaryMandatory": true,
      "value": [
        51,
        100
      ]
    },
    "ppEconomicGroup": {
      "guardrails": {
        "VT-GEN-01": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-01b": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-02": {
          "description": "Economic, network, and technical parameters thresholds must be in the range 51%-75%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-02b": {
          "description": "Economic, network, and technical parameters thresholds must be in the range 51%-75%",
          "isMandatory": true,
          "message": null,
          "result": true
        }
      },
      "summary": true,
      "summaryMandatory": true,
      "value": [
        51,
        100
      ]
    },
    "ppGovernanceGroup": {
      "guardrails": {
        "VT-GEN-01": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-01b": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GOV-01": {
          "description": "Governance parameter thresholds must be in the range 75%-90%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GOV-01b": {
          "description": "Governance parameter thresholds must be in the range 75%-90%",
          "isMandatory": true,
          "message": null,
          "result": true
        }
      },
      "summary": true,
      "summaryMandatory": true,
      "value": [
        3,
        4
      ]
    },
    "ppNetworkGroup": {
      "guardrails": {
        "VT-GEN-01": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-01b": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-02": {
          "description": "Economic, network, and technical parameters thresholds must be in the range 51%-75%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-02b": {
          "description": "Economic, network, and technical parameters thresholds must be in the range 51%-75%",
          "isMandatory": true,
          "message": null,
          "result": true
        }
      },
      "summary": true,
      "summaryMandatory": true,
      "value": [
        51,
        100
      ]
    },
    "ppTechnicalGroup": {
      "guardrails": {
        "VT-GEN-01": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-01b": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-02": {
          "description": "Economic, network, and technical parameters thresholds must be in the range 51%-75%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-02b": {
          "description": "Economic, network, and technical parameters thresholds must be in the range 51%-75%",
          "isMandatory": true,
          "message": null,
          "result": true
        }
      },
      "summary": true,
      "summaryMandatory": true,
      "value": [
        51,
        100
      ]
    },
    "treasuryWithdrawal": {
      "guardrails": {
        "VT-GEN-01": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-01b": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        }
      },
      "summary": true,
      "summaryMandatory": true,
      "value": [
        1,
        2
      ]
    },
    "updateConstitution": {
      "guardrails": {
        "VT-CON-01": {
          "description": "Update Constitution or proposal policy action thresholds must be in the range 65%-90%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-CON-01b": {
          "description": "Update Constitution or proposal policy action thresholds must be in the range 65%-90%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-01": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-01b": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        }
      },
      "summary": true,
      "summaryMandatory": true,
      "value": [
        13,
        20
      ]
    }
  },
  "executionUnitPrices": {
    "priceMemory": {
      "guardrails": {
        "EIUP-GEN-01": {
          "description": "The execution prices must be set so that i) the cost of executing a transaction with maximum CPU steps is similar to the cost of a maximum sized non-script transaction and ii) the cost of executing a transaction with maximum memory units is similar to the cost of a maximum sized non-script transaction",
          "isMandatory": false,
          "message": "Please contribute to this check.",
          "result": null
        },
        "EIUP-GEN-02": {
          "description": "The execution prices should be adjusted whenever transaction fees are adjusted (txFeeFixed/txFeePerByte). The goal is to ensure that the processing delay is similar for \"full\" transactions, regardless of their type. This helps ensure that the requirements on block diffusion/propagation times are met.",
          "isMandatory": false,
          "message": "Please contribute to this check.",
          "result": null
        },
        "EIUP-PM-01": {
          "description": "executionUnitPrices[priceMemory] must not exceed 2_000 / 10_000",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "EIUP-PM-02": {
          "description": "executionUnitPrices[priceMemory] must not be lower than 400 / 10_000",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "NETWORK-01": {
          "description": "No individual network parameter **should** change more than once per two epochs",
          "isMandatory": false,
          "message": null,
          "result": true
        },
        "NETWORK-02": {
          "description": "Only one network parameter **should** be changed per epoch unless they are directly correlated",
          "isMandatory": false,
          "message": "",
          "result": false
        }
      },
      "summary": false,
      "summaryMandatory": true,
      "value": [
        1,
        25
      ]
    },
    "priceSteps": {
      "guardrails": {
        "EIUP-GEN-01": {
          "description": "The execution prices must be set so that i) the cost of executing a transaction with maximum CPU steps is similar to the cost of a maximum sized non-script transaction and ii) the cost of executing a transaction with maximum memory units is similar to the cost of a maximum sized non-script transaction",
          "isMandatory": false,
          "message": "Please contribute to this check.",
          "result": null
        },
        "EIUP-GEN-02": {
          "description": "The execution prices should be adjusted whenever transaction fees are adjusted (txFeeFixed/txFeePerByte). The goal is to ensure that the processing delay is similar for \"full\" transactions, regardless of their type. This helps ensure that the requirements on block diffusion/propagation times are met.",
          "isMandatory": false,
          "message": "Please contribute to this check.",
          "result": null
        },
        "EIUP-PS-01": {
          "description": "executionUnitPrices[priceSteps] must not exceed 2,000 / 10,000,000",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "EIUP-PS-02": {
          "description": "executionUnitPrices[priceSteps] must not be lower than 500 / 10,000,000",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "NETWORK-01": {
          "description": "No individual network parameter **should** change more than once per two epochs",
          "isMandatory": false,
          "message": null,
          "result": true
        },
        "NETWORK-02": {
          "description": "Only one network parameter **should** be changed per epoch unless they are directly correlated",
          "isMandatory": false,
          "message": "",
          "result": false
        }
      },
      "summary": false,
      "summaryMandatory": true,
      "value": [
        1,
        20000
      ]
    },
  },
  "govActionLifetime": {
    "guardrails": {
      "GAL-01": {
        "description": "govActionLifetime must not be lower than 1 epoch (5 days)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "GAL-02": {
        "description": "govActionLifetime must not be greater than 15 epochs (75 days)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "GAL-03": {
        "description": "govActionLifetime should not be lower than 2 epochs (10 days)",
        "isMandatory": false,
        "message": "govActionLifetime should not be lower than 2 epochs",
        "result": false
      },
      "GAL-04": {
        "description": "govActionLifetime should be calibrated in human terms (eg 30 days, two weeks), to allow sufficient time for voting etc. to take place",
        "isMandatory": false,
        "message": null,
        "result": true
      },
      "GAL-05": {
        "description": "govActionLifetime must be less than dRepActivity",
        "isMandatory": true,
        "message": null,
        "result": true
      }
    },
    "summary": false,
    "summaryMandatory": true,
    "value": 1
  },
  "govDeposit": {
    "guardrails": {
      "GD-01": {
        "description": "govDeposit must not be negative",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "GD-02": {
        "description": "govDeposit must not be lower than 1,000,000 (1 ada)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "GD-03": {
        "description": "govDeposit must not exceed 10,000,000,000,000 (10 Million ada)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "GD-04": {
        "description": "govDeposit should be adjusted in line with fiat changes",
        "isMandatory": false,
        "message": "Please contribute to the check",
        "result": null
      }
    },
    "summary": true,
    "summaryMandatory": true,
    "value": 1000000
  },
  "maxBlockBodySize": {
    "guardrails": {
      "MBBS-01": {
        "description": "maxBlockBodySize must not exceed 122,880 Bytes (120KB)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "MBBS-02": {
        "description": "maxBlockBodySize must not be lower than 24,576 Bytes (24KB)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "MBBS-03": {
        "description": "maxBlockBodySize must not be decreased, other than in exceptional circumstances where there are potential problems with security, performance or functionality",
        "isMandatory": false,
        "message": "maxBlockBodySize must not be decreased",
        "result": false
      },
      "MBBS-04": {
        "description": "maxBlockBodySize must be large enough to include at least one transaction (that is, maxBlockBodySize must be at least maxTxSize)",
        "isMandatory": false,
        "message": null,
        "result": true
      },
      "MBBS-05": {
        "description": "maxBlockBodySize should be changed by at most 10,240 Bytes (10KB) per epoch (5 days), and preferably by 8,192 Bytes (8KB) or less per epoch",
        "isMandatory": false,
        "message": "maxBlockBodySize should be changed by at most 10,240 Bytes (10KB) per epoch (5 days). Your change was for 65536 Bytes",
        "result": false
      },
      "MBBS-06": {
        "description": "The block size should not induce an additional TCP round trip.",
        "isMandatory": false,
        "message": "Please contribute to the check",
        "result": null
      },
      "MBBS-07": {
        "description": "The impact of any change to maxBlockBodySize must be confirmed by detailed benchmarking/simulation and not exceed the requirements of the block diffusion/propagation time budgets, as described below. Any increase to maxBlockBodySize must also consider future requirements for Plutus script execution (maxBlockExecutionUnits[steps]) against the total block diffusion target of 3s with 95% block propagation within 5s. The limit on maximum block size may be increased in the future if this is supported by benchmarking and monitoring results",
        "isMandatory": false,
        "message": "Please contribute to the check",
        "result": null
      }
    },
    "summary": false,
    "summaryMandatory": true,
    "value": 24576
  },
  "maxBlockExecutionUnits": {
    "memory": {
      "guardrails": {
        "MBEU-M-01": {
          "description": "maxBlockExecutionUnits[memory] must not exceed 120,000,000 units",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "MBEU-M-02": {
          "description": "maxBlockExecutionUnits[memory] must not be negative",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "MBEU-M-03": {
          "description": "maxBlockExecutionUnits[memory] should not be changed (increased or decreased) by more than 10,000,000 units in any epoch",
          "isMandatory": false,
          "message": "maxBlockExecutionUnits[memory] not found",
          "result": false
        },
        "MBEU-M-04": {
          "description": "The impact of any change to maxBlockExecutionUnits[memory] must be confirmed by detailed benchmarking/simulation and not exceed the requirements of the diffusion/propagation time budgets, as also impacted by (maxBlockExecutionUnits[steps]).",
          "isMandatory": false,
          "message": "Please contribute to this check.",
          "result": null
        },
        "MEU-M-01": {
          "description": "maxBlockExecutionUnits[memory] must not be less than maxTxExecutionUnits[memory]",
          "isMandatory": false,
          "message": null,
          "result": true
        },
        "NETWORK-01": {
          "description": "No individual network parameter **should** change more than once per two epochs",
          "isMandatory": false,
          "message": null,
          "result": true
        },
        "NETWORK-02": {
          "description": "Only one network parameter **should** be changed per epoch unless they are directly correlated",
          "isMandatory": false,
          "message": "",
          "result": false
        }
      },
      "summary": false,
      "summaryMandatory": true,
      "value": 0
    },
    "steps": {
      "guardrails": {
        "MBEU-S-01": {
          "description": "maxBlockExecutionUnits[steps] must not exceed 40,000,000,000 (40Bn) units",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "MBEU-S-02": {
          "description": "maxBlockExecutionUnits[steps] must not be negative",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "MBEU-S-03": {
          "description": "maxBlockExecutionUnits[steps] should not be changed (increased or decreased) by more than 2,000,000,000 (2Bn) units in any epoch (5 days)",
          "isMandatory": false,
          "message": null,
          "result": true
        },
        "MBEU-S-04": {
          "description": "The impact of the change to maxBlockExecutionUnits[steps] must be confirmed by detailed benchmarking/simulation and not exceed the requirements of the block diffusion/propagation time budgets, as also impacted by maxBlockExecutionUnits[memory]. Any increase must also consider previously identified future requirements for the total block size (maxBlockBodySize) measured against the total block diffusion target of 3s with 95% block propagation within 5s. Future Plutus performance improvements may allow the per-block limit to be increased, but must be balanced against the overall diffusion limits as specified in the previous sentence, and future requirements",
          "isMandatory": false,
          "message": "Please contribute to this check.",
          "result": null
        },
        "MEU-S-01": {
          "description": "maxBlockExecutionUnits[steps] must not be less than maxTxExecutionUnits[steps]",
          "isMandatory": false,
          "message": null,
          "result": true
        },
        "NETWORK-01": {
          "description": "No individual network parameter **should** change more than once per two epochs",
          "isMandatory": false,
          "message": null,
          "result": true
        },
        "NETWORK-02": {
          "description": "Only one network parameter **should** be changed per epoch unless they are directly correlated",
          "isMandatory": false,
          "message": "",
          "result": false
        }
      },
      "summary": false,
      "summaryMandatory": true,
      "value": 0
    },
  },
  "maxBlockHeaderSize": {
    "guardrails": {
      "MBHS-01": {
        "description": "maxBlockHeaderSize must not exceed 5,000 Bytes",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "MBHS-02": {
        "description": "maxBlockHeaderSize must not be negative",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "MBHS-03": {
        "description": "maxBlockHeaderSize must be large enough for the largest valid header",
        "isMandatory": false,
        "message": "Please contribute to the check",
        "result": null
      },
      "MBHS-04": {
        "description": "maxBlockHeaderSize should only normally be increased if the protocol changes",
        "isMandatory": false,
        "message": "maxBlockHeaderSize must not be decreased",
        "result": false
      },
      "MBHS-05": {
        "description": "maxBlockHeaderSize should be within TCP's initial congestion window (3 or 10 MTUs)",
        "isMandatory": false,
        "message": "Please contribute to the check",
        "result": null
      }
    },
    "summary": false,
    "summaryMandatory": true,
    "value": 0
  },
  "maxCollateralInputs": {
    "guardrails": {
      "MCI-01": {
        "description": "maxCollateralInputs must not be lower than 1",
        "isMandatory": true,
        "message": null,
        "result": true
      }
    },
    "summary": true,
    "summaryMandatory": true,
    "value": 1
  },
  "maxTxExecutionUnits": {
    "mem": {
      "guardrails": {
        "MTEU-M-01": {
          "description": "maxTxExecutionUnits[memory] must not exceed 40,000,000 units",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "MTEU-M-02": {
          "description": "maxTxExecutionUnits[memory] must not be negative",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "MTEU-M-03": {
          "description": "maxTxExecutionUnits[memory] must not be decreased",
          "isMandatory": false,
          "message": "maxTxExecutionUnits[memory] must not be decreased",
          "result": false
        },
        "MTEU-M-04": {
          "description": "maxTxExecutionUnits[memory] should not be increased by more than 2,500,000 units in any epoch",
          "isMandatory": false,
          "message": null,
          "result": true
        },
        "NETWORK-01": {
          "description": "No individual network parameter **should** change more than once per two epochs",
          "isMandatory": false,
          "message": null,
          "result": true
        },
        "NETWORK-02": {
          "description": "Only one network parameter **should** be changed per epoch unless they are directly correlated",
          "isMandatory": false,
          "message": "",
          "result": false
        }
      },
      "summary": false,
      "summaryMandatory": true,
      "value": 0
    },
    "steps": {
      "guardrails": {
        "MTEU-S-01": {
          "description": "maxTxExecutionUnits[steps] must not exceed 15,000,000,000 (15Bn) units",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "MTEU-S-02": {
          "description": "maxTxExecutionUnits[steps] must not be negative",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "MTEU-S-03": {
          "description": "maxTxExecutionUnits[steps] must not be decreased",
          "isMandatory": false,
          "message": "maxTxExecutionUnits[steps] must not be decreased",
          "result": false
        },
        "MTEU-S-04": {
          "description": "*maxTxExecutionUnits[steps]* **should not** be increased by more than 500,000,000 (500M) units in any epoch (5 days)",
          "isMandatory": false,
          "message": "Please contribute to this check.",
          "result": null
        },
        "NETWORK-01": {
          "description": "No individual network parameter **should** change more than once per two epochs",
          "isMandatory": false,
          "message": null,
          "result": true
        },
        "NETWORK-02": {
          "description": "Only one network parameter **should** be changed per epoch unless they are directly correlated",
          "isMandatory": false,
          "message": "",
          "result": false
        }
      },
      "summary": false,
      "summaryMandatory": true,
      "value": 0
    },
  },
  "maxTxSize": {
    "guardrails": {
      "MTS-01": {
        "description": "maxTxSize must not exceed 32,768 Bytes (32KB)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "MTS-02": {
        "description": "maxTxSize must not be negative",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "MTS-03": {
        "description": "maxTxSize must not be decreased",
        "isMandatory": false,
        "message": "maxTxSize must not be decreased",
        "result": false
      },
      "MTS-04": {
        "description": "maxTxSize must not exceed maxBlockBodySize",
        "isMandatory": false,
        "message": null,
        "result": true
      },
      "MTS-05": {
        "description": "maxTxSize should not be increased by more than 2,560 Bytes (2.5KB) in any epoch and preferably should be increased by 2,048 Bytes (2KB) or less per epoch",
        "isMandatory": false,
        "message": null,
        "result": true
      },
      "MTS-06": {
        "description": "maxTxSize should not exceed 1/4 of the block size",
        "isMandatory": false,
        "message": "maxBlockSize not found",
        "result": false
      }
    },
    "summary": false,
    "summaryMandatory": true,
    "value": 0
  },
  "maxValueSize": {
    "guardrails": {
      "MVS-01": {
        "description": "maxValueSize must not exceed 12,288 Bytes (12KB)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "MVS-02": {
        "description": "maxValueSize must not be negative",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "MVS-03": {
        "description": "maxValueSize must be less than maxTxSize",
        "isMandatory": false,
        "message": "maxValueSize must be less than maxTxSize",
        "result": false
      },
      "MVS-04": {
        "description": "maxValueSize must not be reduced",
        "isMandatory": false,
        "message": "maxValueSize must not be reduced",
        "result": false
      },
      "MVS-05": {
        "description": "maxValueSize must be large enough to allow sensible outputs",
        "isMandatory": false,
        "message": "Please contribute to the check",
        "result": null
      }
    },
    "summary": false,
    "summaryMandatory": true,
    "value": 0
  },
  "minFeeRefScriptCoinsPerByte": {
    "guardrails": {
      "MFRS-01": {
        "description": "minFeeRefScriptCoinsPerByte must not exceed 1,000 (0.001 ada)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "MFRS-02": {
        "description": "minFeeRefScriptCoinsPerByte must not be negative",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "MFRS-03": {
        "description": "To maintain a consistent level of protection against denial-of-service attacks, minFeeRefScriptCoinsPerByte should be adjusted whenever Plutus Execution prices are adjusted (executionUnitPrices[steps/memory]) and whenever txFeeFixed is adjusted",
        "isMandatory": false,
        "message": "minFeeRefScriptCoinsPerByte should be adjusted whenever Plutus Execution prices are adjusted (executionUnitPrices[steps/memory]) and whenever txFeeFixed is adjusted",
        "result": false
      },
      "MFRS-04": {
        "description": "Any changes to minFeeRefScriptCoinsPerByte must consider the implications of reducing the cost of a denial-of-service attack or increasing the maximum transaction fee",
        "isMandatory": false,
        "message": "Please contribute to the check",
        "result": null
      }
    },
    "summary": false,
    "summaryMandatory": true,
    "value": 0
  },
  "minPoolCost": {
    "guardrails": {
      "MPC-01": {
        "description": "minPoolCost must not be negative",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "MPC-02": {
        "description": "minPoolCost must not exceed 500,000,000 (500 ada)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "MPC-03": {
        "description": "minPoolCost should be set in line with the economic cost for operating a pool",
        "isMandatory": false,
        "message": "Please contribute to the check",
        "result": null
      }
    },
    "summary": true,
    "summaryMandatory": true,
    "value": 0
  },
  "monetaryExpansion": {
    "guardrails": {
      "ME-01": {
        "description": "monetaryExpansion must not exceed 0.005",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "ME-02": {
        "description": "monetaryExpansion must not be lower than 0.001",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "ME-03": {
        "description": "monetaryExpansion must not be negative",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "ME-04": {
        "description": "monetaryExpansion should not be varied by more than +/- 10% in any 73-epoch period (approximately 12 months)",
        "isMandatory": false,
        "message": "monetaryExpansion varied by more than +/- 10% from epoch Epoch 428 where monetaryExpansion was: 3 % 1000)",
        "result": false
      },
      "ME-05": {
        "description": "monetaryExpansion should not be changed more than once in any 36-epoch period (approximately 6 months)",
        "isMandatory": false,
        "message": "Please contribute to the check",
        "result": null
      }
    },
    "summary": false,
    "summaryMandatory": true,
    "value": [
      1,
      1000
    ]
  },
  "poolPledgeInfluence": {
    "guardrails": {
      "PPI-01": {
        "description": "poolPledgeInfluence must not be lower than 0.1",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "PPI-02": {
        "description": "poolPledgeInfluence must not exceed 1.0",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "PPI-03": {
        "description": "poolPledgeInfluence must not be negative",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "PPI-04": {
        "description": "poolPledgeInfluence should not vary by more than +/- 10% in any 18-epoch period (approximately 3 months)",
        "isMandatory": false,
        "message": "Please contribute to the check",
        "result": null
      }
    },
    "summary": true,
    "summaryMandatory": true,
    "value": [
      1,
      10
    ]
  },
  "poolRetireMaxEpoch": {
    "guardrails": {
      "PRME-01": {
        "description": "poolRetireMaxEpoch must not be negative",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "PRME-02": {
        "description": "poolRetireMaxEpoch should not be lower than 1",
        "isMandatory": false,
        "message": "poolRetireMaxEpoch should not be lower than 1",
        "result": false
      }
    },
    "summary": false,
    "summaryMandatory": true,
    "value": 0
  },
  "poolVotingThresholds": {
    "committeeNoConfidence": {
      "guardrails": {
        "VT-CC-01": {
          "description": "Update Constitutional Committee action thresholds must be in the range 65%-90%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-CC-01b": {
          "description": "Update Constitutional Committee action thresholds must be in the range 65%-90%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-01": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-01b": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        }
      },
      "summary": true,
      "summaryMandatory": true,
      "value": [
        13,
        20
      ]
    },
    "committeeNormal": {
      "guardrails": {
        "VT-CC-01": {
          "description": "Update Constitutional Committee action thresholds must be in the range 65%-90%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-CC-01b": {
          "description": "Update Constitutional Committee action thresholds must be in the range 65%-90%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-01": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-01b": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        }
      },
      "summary": true,
      "summaryMandatory": true,
      "value": [
        13,
        20
      ]
    },
    "hardForkInitiation": {
      "guardrails": {
        "VT-GEN-01": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-01b": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-HF-01": {
          "description": "Hard fork action thresholds must be in the range 51%-80%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-HF-01b": {
          "description": "Hard fork action thresholds must be in the range 51%-80%",
          "isMandatory": true,
          "message": null,
          "result": true
        }
      },
      "summary": true,
      "summaryMandatory": true,
      "value": [
        51,
        100
      ]
    },
    "motionNoConfidence": {
      "guardrails": {
        "VT-GEN-01": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-01b": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-NC-01": {
          "description": "No confidence action thresholds must be in the range 51%-75%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-NC-01b": {
          "description": "No confidence action thresholds must be in the range 51%-75%",
          "isMandatory": true,
          "message": null,
          "result": true
        }
      },
      "summary": true,
      "summaryMandatory": true,
      "value": [
        51,
        100
      ]
    },
    "ppSecurityGroup": {
      "guardrails": {
        "VT-GEN-01": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        },
        "VT-GEN-01b": {
          "description": "All thresholds must be in the range 50%-100%",
          "isMandatory": true,
          "message": null,
          "result": true
        }
      },
      "summary": true,
      "summaryMandatory": true,
      "value": [
        1,
        2
      ]
    },
  },
  "stakeAddressDeposit": {
    "guardrails": {
      "SAD-01": {
        "description": "stakeAddressDeposit must not be lower than 1,000,000 (1 ada)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "SAD-02": {
        "description": "stakeAddressDeposit must not exceed 5,000,000 (5 ada)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "SAD-03": {
        "description": "stakeAddressDeposit must not be negative",
        "isMandatory": true,
        "message": null,
        "result": true
      }
    },
    "summary": true,
    "summaryMandatory": true,
    "value": 1000000
  },
  "stakePoolDeposit": {
    "guardrails": {
      "SDP-03": {
        "description": "stakePoolDeposit must not be negative",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "SPD-01": {
        "description": "stakePoolDeposit must not be lower than 250,000,000 (250 ada)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "SPD-02": {
        "description": "stakePoolDeposit must not exceed 500,000,000 (500 ada)",
        "isMandatory": true,
        "message": null,
        "result": true
      }
    },
    "summary": true,
    "summaryMandatory": true,
    "value": 250000000
  },
  "stakePoolTargetNum": {
    "guardrails": {
      "SPTN-01": {
        "description": "stakePoolTargetNum must not be lower than 250",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "SPTN-02": {
        "description": "stakePoolTargetNum must not exceed 2,000",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "SPTN-03": {
        "description": "stakePoolTargetNum must not be negative",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "SPTN-04": {
        "description": "stakePoolTargetNum must not be zero",
        "isMandatory": true,
        "message": null,
        "result": true
      }
    },
    "summary": true,
    "summaryMandatory": true,
    "value": 250
  },
  "treasuryCut": {
    "guardrails": {
      "TC-01": {
        "description": "treasuryCut must not be lower than 0.1 (10%)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "TC-02": {
        "description": "treasuryCut must not exceed 0.3 (30%)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "TC-03": {
        "description": "treasuryCut must not be negative",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "TC-04": {
        "description": "treasuryCut must not exceed 1.0 (100%)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "TC-05": {
        "description": "treasuryCut must not be changed more than once in any 36 epoch period (approximately 6 months)",
        "isMandatory": false,
        "message": "Please contribute to the check",
        "result": null
      }
    },
    "summary": true,
    "summaryMandatory": true,
    "value": [
      1,
      10
    ]
  },
  "txFeeFixed": {
    "guardrails": {
      "TFF-01": {
        "description": "txFeeFixed must not be lower than 100,000 (0.1 ada)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "TFF-02": {
        "description": "txFeeFixed must not exceed 10,000,000 (10 ada)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "TFF-03": {
        "description": "txFeeFixed must not be negative",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "TFGEN-01": {
        "description": "To maintain a consistent level of protection against denial-of-service attacks, txFeeFixed and txFeeFixed should be adjusted whenever Plutus Execution prices are adjusted (executionUnitPrices[steps/memory]).",
        "isMandatory": false,
        "message": "Please contribute to the check",
        "result": null
      },
      "TFGEN-02": {
        "description": "Any changes to  txFeeFixed or txFeeFixed must consider the implications of reducing the cost of a denial-of-service attack or increasing the maximum transaction fee so that it becomes impossible to construct a transaction.",
        "isMandatory": false,
        "message": "Please contribute to the check",
        "result": null
      }
    },
    "summary": true,
    "summaryMandatory": true,
    "value": 100000
  },
  "txFeePerByte": {
    "guardrails": {
      "TFGEN-01": {
        "description": "TFGEN-01 is null",
        "isMandatory": false,
        "message": "Please contribute to the check",
        "result": null
      },
      "TFGEN-02": {
        "description": "TFGEN-02 is null",
        "isMandatory": true,
        "message": "Please contribute to the check",
        "result": null
      },
      "TFPB-01": {
        "description": "TFPB-01 is passing",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "TFPB-02": {
        "description": "TFPB-02 is mandatory and failing",
        "isMandatory": true,
        "message": null,
        "result": false
      },
      "TFPB-03": {
        "description": "TFPB-03 is not mandatory and failing",
        "isMandatory": false,
        "message": null,
        "result": false
      }
    },
    "summary": true,
    "summaryMandatory": true,
    "value": 30
  },
  "utxoCostPerByte": {
    "guardrails": {
      "UCPB-01": {
        "description": "utxoCostPerByte must not be lower than 3,000 (0.003 ada)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "UCPB-02": {
        "description": "utxoCostPerByte must not exceed 6,500 (0.0065 ada)",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "UCPB-03": {
        "description": "utxoCostPerByte must not be set to 0",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "UCPB-04": {
        "description": "utxoCostPerByte must not be negative",
        "isMandatory": true,
        "message": null,
        "result": true
      },
      "UCPB-05": {
        "description": "Changes need to account for i) The acceptable cost of attack ii) The acceptable time for an attack (at least one epoch is assumed) iii) The acceptable memory configuration for full node users (assumed to be 16GB for wallets or 24GB for stake pools) iv) The sizes of UTxOs (~200B per UTxO minimum, up to about 10KB) and v) The current total node memory usage)",
        "isMandatory": false,
        "message": "Please contribute to the check",
        "result": null
      }
    },
    "summary": true,
    "summaryMandatory": true,
    "value": 3000
  }
}