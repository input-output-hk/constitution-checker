import axios from "axios";
import { create } from "zustand";
import { mapInitialJsonStateToCurrentJsonState } from "./utils/mapper";

import type { InitialJsonState, CurrentJsonState, ProposalValues, ValidationResult } from "./types";

export type State = {
  loading: boolean;
  error: null | string;
  currentTab: string;
  drawerOpen: boolean;
  selectedRowName: string;
  initialJsonState: InitialJsonState | undefined;
  currentJsonState: CurrentJsonState | undefined;
  validationResults: ValidationResult | undefined;
};

export type Action = {
  fetchJsonInitialState: () => void;
  updateCurrentJsonFieldState: (field: string, value: string) => void;
  postParametersProposal: (data: ProposalValues) => Promise<any>;
  changeSelectedTab: (tabName: string) => void;
  toggleMoreDetailsDrawer: (value: boolean) => void;
  changeSelectedRowName: (rowName: string) => void;
};

const useStore = create<State & Action>((set, get) => ({
  loading: false,
  error: null,
  currentTab: 'Proposal Parameters',
  drawerOpen: false,
  selectedRowName: '',
  
  // Holds initial JSON state
  initialJsonState: undefined,

  // Holds updated proposal form state
  currentJsonState: undefined,
  
  // Holds updated state from POST response
  validationResults: undefined,

  // Used only to load initial app state from Cardano
  fetchJsonInitialState: async () => {
    set({ loading: true, error: null });
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

  changeSelectedTab: (tabName) => set({currentTab: tabName}),
  toggleMoreDetailsDrawer: (value) => set({drawerOpen: value}),
  changeSelectedRowName: (rowName) => set({selectedRowName: rowName}),
}));

export default useStore;