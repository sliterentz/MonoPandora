import { createSlice, Dispatch } from '@reduxjs/toolkit';

import { IUserAuth } from '@theme-ui';

// utils
import { axios } from '@theme-ui';

const userToken = localStorage.getItem('accessToken')
  ? localStorage.getItem('accessToken')
  : null;

const initialState: IUserAuth = {
  isLoading: false,
  userInfo: [],
  userToken,
  error: [],
  success: false,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem('accessToken') // deletes token from storage
      state.isLoading = false
      state.userInfo = []
      state.userToken = null
      state.error = []
    },

    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

     // GET PROFILE DATA
    getProfileSuccess(state, action) {
      state.isLoading = false;
      state.userInfo = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getProfileSuccess,
} = slice.actions;

export function fetchUserData() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const accessToken = userToken;
      const headers = {
        'Authorization': 'Bearer '+ accessToken,
      }
      const response = await axios.get('/api/v1/auth/profile', { headers });
      
      dispatch(slice.actions.getProfileSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}