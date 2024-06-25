import { createSlice, Dispatch } from '@reduxjs/toolkit';

// utils
import { axios } from '@theme-ui';
import { IRoleState } from '@theme-ui';

const userToken = localStorage.getItem('accessToken')
  ? localStorage.getItem('accessToken')
  : null;

const initialState: IRoleState = {
  isLoading: false,
  error: null,
  roles: [],
  role: null,
};

const slice = createSlice({
  name: 'role',
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

     // GET ROLES
    getRolesSuccess(state, action) {
      state.isLoading = false;
      state.roles = action.payload;
    },

    // GET ROLE
    getRoleSuccess(state, action) {
      state.isLoading = false;
      state.role = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
// export const {
//   getRolesSuccess,
//   getRoleSuccess,
// } = slice.actions;

export function fetchRolesData() {
return async (dispatch: Dispatch) => {
  dispatch(slice.actions.startLoading());
    try {
      const accessToken = userToken;
      const headers = {
        'Authorization': 'Bearer '+ accessToken,
      }

      const response = await axios.get('/api/v1/role', { params: { page: 1, take: 5 }, headers });
      dispatch(slice.actions.getRolesSuccess(response.data.data.content))
    } catch(error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function fetchRoleData(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
      try {
        const accessToken = userToken;
        const headers = {
          'Authorization': 'Bearer '+ accessToken,
        }

        const response = await axios.get('/api/v1/role/'+id, { headers });

        dispatch(slice.actions.getRoleSuccess(response.data))
      } catch(error) {
        dispatch(slice.actions.hasError(error));
      }
    };
  }