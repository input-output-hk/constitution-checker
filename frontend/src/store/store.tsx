import axios from "axios";
import { create } from "zustand";
import { mapInitialJsonStateToCurrentJsonState, mapPostValuesToInitialJsonValues } from "./mapper";

import type { InitialJsonState, CurrentJsonState, ProposalValues, ValidationResult } from "./types";

export type State = {
  resetForm: boolean;
  error: null | string;
  currentTab: string;
  drawerOpen: boolean;
  selectedRowName: string[];
  searchValue: string;
  cardanoJsonState: InitialJsonState | undefined;
  initialJsonState: InitialJsonState | undefined;
  currentJsonState: CurrentJsonState | undefined;
  validationResults: ValidationResult | undefined;
};

export type Action = {
  fetchJsonInitialState: () => void;
  updateInitialValues: (importValue: InitialJsonState) => void;
  updateCurrentJsonFieldState: (field: string, value: string) => void;
  postParametersProposal: (data: ProposalValues) => Promise<any>;
  updateValuesFromURL: (url: String) => Promise<any>;
  updateValuesFromTID: (tID: string) => Promise<any>;
  updateValuesFromFile: (importValue: InitialJsonState) => void;
};

const useStore = create<State & Action>((set, get) => ({
  resetForm: false,
  error: null,
  currentTab: 'Proposal Parameters',
  drawerOpen: false,
  selectedRowName: [],
  searchValue: '',
  initialJsonState: undefined,
  cardanoJsonState: undefined,
  currentJsonState: undefined,
  validationResults: undefined,

  // Used only to fetch app state from Cardano
  fetchJsonInitialState: async () => {
    set({ error: null, validationResults: undefined });
    try {
      const response = await axios.get("http://ec2-16-171-11-232.eu-north-1.compute.amazonaws.com:8081/current-values");
      set({
        initialJsonState: response.data,
        cardanoJsonState: response.data,
        currentJsonState: mapInitialJsonStateToCurrentJsonState(response.data),
      });
    } catch (error) {
      console.error("Failed to fetch state from Cardano:", error);
      set({
        error: "Failed to fetch state from Cardano",
      });
    }
  },
  
  // Uses the current app state to check if the parameters pass the guardrail checks
  postParametersProposal: async (data: ProposalValues) => {
    set({ error: null });
    try {
      const response = await axios.post('http://ec2-16-171-11-232.eu-north-1.compute.amazonaws.com:8081/parameters/proposal', data, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Accept': 'application/json;charset=utf-8'
        }
      });

      const checkedCurrentJsonState = {...get().currentJsonState!};
      for (const k of Object.keys(checkedCurrentJsonState)) {
        if ((checkedCurrentJsonState as any)[k].checkStatus) {
          (checkedCurrentJsonState as any)[k].checkStatus = 'checked';
        } else {
          for (const j of Object.keys((checkedCurrentJsonState as any)[k])) {
            (checkedCurrentJsonState as any)[k][j].checkStatus = 'checked';
          }
        }
      }

      set({
        validationResults: response.data,
        currentJsonState: checkedCurrentJsonState,
      }); 
    } catch (error) {
      console.error("Post request to see if paramaters pass guardrail checks failed:", error);
      set({
        error: "Post request to see if paramaters pass guardrail checks failed",
      });
    }
  },

  //use URL to get values from Github self-hosted JSON file
  updateValuesFromURL: async (url: String) => {
    set({ error: null });
    try {
      const response = await axios.post('http://ec2-16-171-11-232.eu-north-1.compute.amazonaws.com:8081/parameters/proposal/by-url', url, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Accept': 'application/json;charset=utf-8',
        },
      });
      const data = response.data;
      get().updateInitialValues(mapPostValuesToInitialJsonValues(data));
    } catch (error) {
      set({
        error: 'Failed to load values from URL',
      });
    }
  },

  updateValuesFromTID: async (txID: String) => {
    try {
      const response = await axios.get(`http://ec2-16-171-11-232.eu-north-1.compute.amazonaws.com:8081/transactions/${txID}`);
      const newState = {...get().cardanoJsonState!};
      for (const k of Object.keys(response.data)) {
        if ((newState as any)[k]) {
          (newState as any)[k] = response.data[k];
        } 
      }
      get().updateInitialValues(newState)
    } catch (error) {
      console.error("Failed to get values from transactionID:", error);
      throw new Error("Failed to get values from transactionID");
    }
  },

  //when value is input field is changed make sure users know the new value is unchecked
  updateCurrentJsonFieldState: (field, value) => {
    const [level1, level2] = field.split('.');
    if (!level2) {
      set({
        currentJsonState: {
          ...get().currentJsonState!,
          [level1]: { value, checkStatus: 'unchecked' }
        }
      });
    } else {
      set({
        currentJsonState: {
          ...get().currentJsonState!,
          [level1]: {
            ...(get().currentJsonState as any)[level1],
            [level2]: { value, checkStatus: 'unchecked' }
          }
        }
      });
    }
  },

  updateValuesFromFile: (importValue) => {
    try {
      const newState = {...get().cardanoJsonState!};
      for (const k of Object.keys(importValue)) {
        if ((newState as any)[k]) {
          (newState as any)[k] = (importValue as any)[k];
        } 
      }
      get().updateInitialValues(newState)
    } catch (error) {
      console.error("Failed to get values from local file:", error);
      throw new Error("Failed to get values from local file");
    }
  },

  //allow user to reset the app state to their preferred initial starting value from Cardano, URL, JSON file, or Transaction ID
  updateInitialValues: (importValue) => {
    set({resetForm: true});

    const newState = mapInitialJsonStateToCurrentJsonState(importValue);
    const currentState = get().currentJsonState;

    for (const k of Object.keys(newState)) {
      if ((newState as any)[k].value) {
        (newState as any)[k].value !== (currentState as any)[k].value 
        ? (newState as any)[k].checkStatus = 'unchecked'
        : (newState as any)[k].checkStatus = 'checked'
      } else {
        for (const j of Object.keys((newState as any)[k])) {
          (newState as any)[k][j].value !== (currentState as any)[k][j].value 
        ? (newState as any)[k][j].checkStatus = 'unchecked'
        : (newState as any)[k][j].checkStatus = 'checked'
        }
      }
    }

    set({
      initialJsonState: importValue,
      currentJsonState: newState,
    });
  },
}));

export default useStore;

