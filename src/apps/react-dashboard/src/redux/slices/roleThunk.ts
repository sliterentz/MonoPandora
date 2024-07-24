import { createSlice, Dispatch } from '@reduxjs/toolkit';

// utils
import { axios } from '@theme-ui';
import { IRoleState } from '@theme-ui';

const userToken = localStorage.getItem('accessToken')
  ? localStorage.getItem('accessToken')
  : null;

const initialState: IRoleState = {
  currentRole: null,
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
      state.currentRole = action.payload;
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

      const response = await axios.get('/api/v1/access/roles', { params: {limit:10}, headers });
      dispatch(slice.actions.getRolesSuccess(response.data.data.data))
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

        const response = await axios.get('/api/v1/access/role/'+id, { headers });

        dispatch(slice.actions.getRoleSuccess(response.data.data))
      } catch(error) {
        dispatch(slice.actions.hasError(error));
      }
    };
  }