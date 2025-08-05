import type { Category } from "@/utils/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CategoryInterface {
  categories: Category[];
  loading: Boolean;
  error: string | null;
}

const initialState: CategoryInterface = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<Category[]>) {
      (state.categories = action.payload), (state.loading = false);
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setCategory, setError, setLoading } = categorySlice.actions;
export default categorySlice.reducer;
