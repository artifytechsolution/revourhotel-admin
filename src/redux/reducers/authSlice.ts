"use client";
// import { UserData, UserState } from "@src/utils/types/authSliceTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState: any = {
  authToken: null,
  userData: null,
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<any>) {
      console.log("user is comming---------")
      console.log(action)
      state.userData = action.payload;
    },
    removeUser(state) {
      state.userData = null;
    },
    setAuthToken(state, action: PayloadAction<string | null>) {
      console.log("select auth token is comminggg")
      console.log(action)
      state.authToken = action.payload;
    },
    removeAuthToken(state) {
      state.authToken = null;
    },
    setsearchdetails(state, action: PayloadAction<any>) {
      state.userData = action.payload;
    },
    removesearchdetails(state) {
      state.userData = null;
    },
  },
});

export const {
  setUser,
  removeUser,
  setAuthToken,
  removeAuthToken,
  setsearchdetails,
  removesearchdetails,
} = authSlice.actions;

export default authSlice.reducer;

export const selectAuthToken = (state: RootState) =>{
  console.log("select auth token is herere!!!!")
  console.log(state.user.userData)
 return state.user.authToken ?? null;
}

export const selectUser = (state: RootState) =>
  state?.user?.userData ?? null;

export const selectSerchdetails = (state: RootState) =>
  state?.app.user.userData ?? null;
