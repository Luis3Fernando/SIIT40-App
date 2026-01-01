import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlantData } from '@models/PlantData';

interface PlantsState {
  inventory: PlantData[];
}

const initialState: PlantsState = {
  inventory: [],
};

export const plantsSlice = createSlice({
  name: 'plants',
  initialState,
  reducers: {
    setInventory: (state, action: PayloadAction<PlantData[]>) => {
      state.inventory = action.payload;
    },
    addPlantToInventory: (state, action: PayloadAction<PlantData>) => {
      state.inventory.push(action.payload);
    },
  },
});

export const { setInventory, addPlantToInventory } = plantsSlice.actions;
export default plantsSlice.reducer;