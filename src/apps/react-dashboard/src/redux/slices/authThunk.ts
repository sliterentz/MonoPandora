import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit';

// utils
import {axios} from '@theme-ui';

// const initialState: IUserData = {
//   fullname: string,
//   email: string,
//   password: string,
//   grant: number,
//   isVerrified: number,
// };

export const fetchUserData = createAsyncThunk('auth/fetchUserData', async (_, {rejectWithValue}) => {
  try {
    const accessToken = getToken();
    api.defaults.headers.Authorization = `Bearer ${accessToken}`;
    const response = await axios.get('/api/products');
    return {...response.data, accessToken};
  } catch(e) {
    removeToken();
    return rejectWithValue('');
  }
});
