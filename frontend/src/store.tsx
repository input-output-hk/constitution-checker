import axios from "axios";
import { create } from "zustand";
import { mapInitialJsonStateToCurrentJsonState } from "./utils/mapper";

import type { InitialJsonState, CurrentJsonState, ProposalValues, ValidationResult } from "./types";

export type State = {
  loading: boolean;
  resetForm: boolean;
  error: null | string;
  currentTab: string;
  drawerOpen: boolean;
  selectedRowName: string[];
  searchValue: string;
  initialJsonState: InitialJsonState | undefined;
  currentJsonState: CurrentJsonState | undefined;
  validationResults: ValidationResult | undefined;
};

export type Action = {
  fetchJsonInitialState: () => void;
  updateInitialJsonValue: (importValue: InitialJsonState) => void;
  updateCurrentJsonFieldState: (field: string, value: string) => void;
  postParametersProposal: (data: ProposalValues) => Promise<any>;
  changeSelectedTab: (tabName: string) => void;
  changeSearchValue: (value: string) => void;
  toggleMoreDetailsDrawer: (value: boolean) => void;
  changeTableDetails: (rowName: string, parameterName?: string) => void;
};

const useStore = create<State & Action>((set, get) => ({
  loading: false,
  resetForm: false,
  error: null,
  currentTab: 'Proposal Parameters',
  drawerOpen: false,
  selectedRowName: [],
  searchValue: '',
  
  // Holds initial JSON state
  initialJsonState: undefined,

  // Holds updated proposal form state
  currentJsonState: undefined,
  
  // Holds updated state from POST response
  validationResults: undefined,

  // Used only to load initial app state from Cardano
  fetchJsonInitialState: async () => {
    set({ loading: true, error: null, validationResults: undefined });
    try {
      const response = await axios.get("http://ec2-16-171-11-232.eu-north-1.compute.amazonaws.com:8081/current-values");
      set({
        initialJsonState: response.data,
        currentJsonState: mapInitialJsonStateToCurrentJsonState(response.data),
        loading: false
      });
    } catch (error) {
      console.error("Failed to fetch initial state:", error);
      set({
        error: "Failed to fetch initial state",
        loading: false
      });
    }
  },
  
  postParametersProposal: async (data: ProposalValues) => {
    set({ loading: true, error: null });
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
        loading: false
      }); 
    } catch (error) {
      console.error("Post request failed:", error);
      set({
        error: "Post request failed",
        loading: false
      });
    }
  },

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

  updateInitialJsonValue: (importValue) => {
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
  

  changeSelectedTab: (tabName) => set({currentTab: tabName}),
  changeSearchValue: (value) => set({searchValue: value}),
  toggleMoreDetailsDrawer: (value) => set({drawerOpen: value}),

  changeTableDetails: (rowName: string, parameterName?: string) => set({
    selectedRowName: parameterName ? [rowName, parameterName] : [rowName]
  }),
}));

export default useStore;