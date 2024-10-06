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
  token: Cookies.get("accessToken")?.toString() ?? "",
  role: "",
};
const getAccount = createAsyncThunk("auth/get-user-token", async () => {
  try {
    const res = await getAccountService().then((res) => res.data );
    // console.log( Cookies.get("accessToken"));
    
    
    
    const responseData = res;
   
      // console.log("account is ", res.data.data);
      return responseData as Account;
    
 
  } catch (error) {
    throw error;
  }
});
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLogin = false;
      state.token = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getAccount.fulfilled,
        (state, action: PayloadAction<Account>) => {
          state.isLogin = true;
          state.role = action.payload.role;
        }
      )
      .addCase(getAccount.rejected, (state) => {
        state.isLogin = false;
        state.role = "";
      });
  },
});
export { getAccount };
export const { logout } = authSlice.actions;

export default authSlice.reducer;
