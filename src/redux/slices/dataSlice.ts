import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DataState {
  availableLogs: string[];
  lastSyncTimestamp: string | null;
}

const initialState: DataState = {
  availableLogs: [],
  lastSyncTimestamp: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setAvailableLogs: (state, action: PayloadAction<string[]>) => {
      state.availableLogs = action.payload;
      state.lastSyncTimestamp = new Date().toISOString();
    }
  }
});

export const { setAvailableLogs } = dataSlice.actions;
export default dataSlice.reducer;