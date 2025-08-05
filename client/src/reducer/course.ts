import type { Course } from "@/utils/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  loading: false,
  error: null,
};

const couseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourse(state, action: PayloadAction<Course[]>) {
      (state.courses = action.payload), (state.loading = false);
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

export const { setCourse, setLoading, setError } = couseSlice.actions;
export default couseSlice.reducer;
