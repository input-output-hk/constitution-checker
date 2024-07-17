import create from 'zustand';
import axios from 'axios';
import { InitialJsonState, CheckedStatus, State, Action } from './types';

const initializeCheckedStatus = (): CheckedStatus => {
    return {
        "0": 'unchecked',
        "1": 'unchecked',
        "2": 'unchecked',
        "3": 'unchecked',
        "4": 'unchecked',
        "5": 'unchecked',
        "6": 'unchecked',
        "7": 'unchecked',
        "8": 'unchecked',
        "9": 'unchecked',
        "10": 'unchecked',
        "11": 'unchecked',
        "16": 'unchecked',
        "17": 'unchecked',
        "18": 'unchecked',
        "19": {
            'priceSteps': 'unchecked',
            'priceMemory': 'unchecked'
        },
        "20": {
            'mem': 'unchecked',
            'steps': 'unchecked'
        },
        "21": {
            'memory': 'unchecked',
            'steps': 'unchecked'
        },
        "22": 'unchecked',
        "23": 'unchecked',
        "24": 'unchecked',
        "25": {
            'committeeNoConfidence': 'unchecked',
            'committeeNormal': 'unchecked',
            'hardForkInitiation': 'unchecked',
            'motionNoConfidence': 'unchecked',
            'ppSecurityGroup': 'unchecked'
        },
        "26": {
            'committeeNoConfidence': 'unchecked',
            'committeeNormal': 'unchecked',
            'hardForkInitiation': 'unchecked',
            'motionNoConfidence': 'unchecked',
            'ppEconomicGroup': 'unchecked',
            'ppGovernanceGroup': 'unchecked',
            'ppNetworkGroup': 'unchecked',
            'ppTechnicalGroup': 'unchecked',
            'treasuryWithdrawal': 'unchecked',
            'updateConstitution': 'unchecked'
        },
        "27": 'unchecked',
        "28": 'unchecked',
        "29": 'unchecked',
        "30": 'unchecked',
        "31": 'unchecked',
        "32": 'unchecked',
        "33": 'unchecked'
    };
};

const useStore = create<State & Action>((set, get) => ({
    //state variables only for app.tsx
    loading: false,
    error: null,
    //holds initial JSON state
    initialJsonState: undefined, 
    //holds updated state from after ui changes
    currentJsonState: undefined, 
    //holds updated state from POST response
    validationResults: undefined,
    checkedStatus: initializeCheckedStatus(),
    currentTab: 'Proposal Parameters',
    drawerOpen: false,
    selectedRowName: [],

    //used only to load initial app state from Cardano
    fetchJsonInitialState: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get("http://ec2-16-171-11-232.eu-north-1.compute.amazonaws.com:8081/current-values");
            set({ initialJsonState: response.data, currentJsonState: response.data, loading: false });
        } catch (error) {
            console.error("Failed to fetch initial state:", error);
            set({ error: "Failed to fetch initial state", loading: false });
        }
    },
    
    postParametersProposal: async (data: InitialJsonState) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post('http://ec2-16-171-11-232.eu-north-1.compute.amazonaws.com:8081/parameters/proposal', data, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Accept': 'application/json;charset=utf-8'
                }
            });
            // Assuming response.data includes the updated validation results
            set({ validationResults: response.data, loading: false });
           
            // Update checked status after the POST request
            const state = get();
            const updatedCheckedStatus = {...state.checkedStatus};
           
            // Helper function to update nested objects
            const updateNestedCheckedStatus = (obj: any) => {
                
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object' && obj[key] !== null) {
                            updateNestedCheckedStatus(obj[key]);
                        } else {
                            obj[key] = 'checked';
                        }
                    }
                }
            };
            updateNestedCheckedStatus(updatedCheckedStatus);
            set({ checkedStatus: updatedCheckedStatus });
            
        } catch (error) {
            console.error("Post request failed:", error);
            set({ error: "Post request failed", loading: false });
        }
    },

    updateInitialJsonState: (json) => set({ initialJsonState: json }),
    //reverts UI back to initial JSON state when refresh btn click
    setCurrentJsonState: (json) => set({ currentJsonState: json }),
    revertToInitialJsonState: () => set((state) => ({ currentJsonState: state.initialJsonState })),

    markFieldAsUnchecked: (key: string) => set((state) => {
        const keys = key.split('.');
        const topKey = keys[0];
        const nestedKey = keys[1];
        
        if (nestedKey) {
            return {
                checkedStatus: {
                    ...state.checkedStatus,
                    [topKey]: {
                        ...(state.checkedStatus[topKey] as object),
                        [nestedKey]: 'unchecked'
                    }
                }
            };
        } else {
            return {
                checkedStatus: {
                    ...state.checkedStatus,
                    [topKey]: 'unchecked'
                }
            };
        }
    }),

    changeSelectedTab: (tabName) => set({currentTab: tabName}),
    toggleMoreDetailsDrawer: (value) => set({drawerOpen: value}),
    changeTableDetails: (rowName: string, parameterName?: string) => set({
        selectedRowName: parameterName ? [rowName, parameterName] : [rowName]
    }),
}));

export default useStore;