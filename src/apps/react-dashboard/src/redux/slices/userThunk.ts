import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit';

// utils
import { axios } from '@theme-ui';
import { IUserState } from '@theme-ui';

const userToken = localStorage.getItem('accessToken')
  ? localStorage.getItem('accessToken')
  : null;

const initialState: IUserState = {
  currentUser: null,
  isLoading: false,
  error: null,
  users: [],
  user: null,
};

// export const fetchUsersData = createAsyncThunk('users/fetchUsersData', async (dispatch: Dispatch) => {
//   dispatch(slice.actions.startLoading());
//     try {
//       const accessToken = userToken;
//       const headers = {
//         'Authorization': 'Bearer '+ accessToken,
//       }

//       const response = await axios.get('/api/v1/auth/users', { headers });
//       // return response.data.data.data
//       return dispatch(slice.actions.getUsersSuccess(response.data.data.data))
//     } catch(error) {
//       dispatch(slice.actions.hasError(error));
//     }
// })

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET USERS
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.users = action.payload;
    },

    // GET USER
    getUserSuccess(state, action) {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.user = action.payload;
    },

  },
  // extraReducers: {
  //   [fetchUsersData.pending]: (state, action) => {
  //     state.isLoading = true;
  //   },
  //   [fetchUsersData.fulfilled]: (state, action) => {
  //     state.isLoading = false;
  //     state.users = action.payload;
  //   },
  // }
});

// Reducer
export default slice.reducer;

// Actions
// export const {
//   getUsersSuccess,
//   getUserSuccess,
// } = slice.actions;

export function fetchUsersData() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
      try {
        const accessToken = userToken;
        const headers = {
          'Authorization': 'Bearer '+ accessToken,
        }

        const response = await axios.get('/api/v1/auth/users', { headers });

        dispatch(slice.actions.getUsersSuccess(response.data.data.data))
      } catch(error) {
        dispatch(slice.actions.hasError(error));
      }
    };
}

export function fetchUserData(id: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
      try {
        const accessToken = userToken;
        const headers = {
          'Authorization': 'Bearer '+ accessToken,
        }

        const response = await axios.get('/api/v1/auth/user/'+id, { headers });

        dispatch(slice.actions.getUserSuccess(response.data.data))
      } catch(error) {
        dispatch(slice.actions.hasError(error));
      }
    };
}
