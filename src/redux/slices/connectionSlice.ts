import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConnectionState {
  isConnectedToGateway: boolean; 
  isApiReachable: boolean;
  currentSSID: string | null;
  lastCheck: string | null;
}

const initialState: ConnectionState = {
  isConnectedToGateway: false,
  isApiReachable: false,
  currentSSID: null,
  lastCheck: null,
};

const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setConnectionInfo: (state, action: PayloadAction<{ ssid: string | null, isSIIT40: boolean }>) => {
      state.currentSSID = action.payload.ssid;
      state.isConnectedToGateway = action.payload.isSIIT40;
      state.lastCheck = new Date().toISOString();
    },
    setApiStatus: (state, action: PayloadAction<boolean>) => {
      state.isApiReachable = action.payload;
    }
  },
});

export const { setConnectionInfo, setApiStatus } = connectionSlice.actions;
export default connectionSlice.reducer;