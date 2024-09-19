import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import { getAccountService } from "../../services/auth.service";
import Cookies from "js-cookie";
import Account from "../../types/account";
export interface Auth {
  isLogin: boolean;
  token: string;
  role: string;
}
const initialState: Auth = {
  isLogin: false,
  token: Cookies.get("accessToken") || "",
  role: "",
};
const getAccount = createAsyncThunk("auth/get-user-token", async () => {
  try {
    const res = await getAccountService();
    if (res?.status) {
      console.log('account is ',res.data.data);
      return res.data.data as Account;
    }
    return {} as Account;
  } catch (error) {
    throw error;
  }
});
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAccount.fulfilled, (state, action:PayloadAction<Account>) => {
        console.log("Get Account Fulfilled: ", action.payload);
        state.isLogin = true;
        state.role = action.payload.role;
      })
      .addCase(getAccount.rejected, (state) => {
        state.isLogin = false;
        state.role = "";
      });
  },
});
export { getAccount };

export default authSlice.reducer;
