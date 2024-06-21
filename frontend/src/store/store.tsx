import create from 'zustand';
import axios from 'axios';

type InitialJsonState = {
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
    "epoch": number
};

type State = {
    //holds initial value of JSON before validation
    initialJsonState: InitialJsonState | undefined;
    //holdes current JSON value after initial validation
    currentJsonState: InitialJsonState | undefined;
    loading: boolean;
}

type Action = {
    fetchJsonInitialState: () => void;
    updateInitialJsonState: (json: InitialJsonState) => void;
    revertToInitialJsonState: () => void;
    setCurrentJsonState: (json: InitialJsonState) => void;
};

const useStore = create<State & Action>((set) => ({
    loading: true,
    //holds initial JSON state
    initialJsonState: undefined, 
    //holds updated state from returned POST request
    currentJsonState: undefined, 

    fetchJsonInitialState: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("http://ec2-16-171-11-232.eu-north-1.compute.amazonaws.com:8080/current-values");
            set({ initialJsonState: response.data, currentJsonState: response.data, loading: false });
        } catch (error) {
            console.error("Failed to fetch initial state:", error);
            set({ loading: false });
        }
    },
    
    updateInitialJsonState: (json) => set({ initialJsonState: json }),
    //reverts UI back to initial JSON state when refresh btn click
    setCurrentJsonState: (json) => set({ currentJsonState: json }),
    revertToInitialJsonState: () => set((state) => ({ currentJsonState: state.initialJsonState })),
}));

export default useStore;