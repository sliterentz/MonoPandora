import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { IPermissionGeneral } from '@theme-ui'

// utils
import { axios } from '@theme-ui';
import { IPermissionState } from '@theme-ui';

const userToken = localStorage.getItem('accessToken')
  ? localStorage.getItem('accessToken')
  : null;
 
const initialState: IPermissionState = {
  currentPermission: null,
  isLoading: false,
  error: null,
  permissions: [],
  permission: null,
};

const slice = createSlice({
  name: 'permission',
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

     // GET PERMISSIONS
    getPermissionsSuccess(state, action) {
      state.isLoading = false;
      state.permissions = action.payload;
    },

    // GET PERMISSION
    getPermissionSuccess(state, action) {
      state.currentPermission = action.payload;
      state.isLoading = false;
      state.permission = action.payload;
    },

    setPermissions(state, action: PayloadAction<IPermissionGeneral[]>) {
      state.permissions = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
// export const {
//   getpermissionsSuccess,
//   getpermissionSuccess,
// } = slice.actions;

export function fetchPermissionsData() {
return async (dispatch: Dispatch) => {
  dispatch(slice.actions.startLoading());
    try {
      const accessToken = userToken;
      const headers = {
        'Authorization': 'Bearer '+ accessToken,
      }

      const response = await axios.get('/api/v1/access/permissions', { params: {limit:20}, headers });
      dispatch(slice.actions.getPermissionsSuccess(response.data.data.data))
    } catch(error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function fetchPermissionData(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
      try {
        const accessToken = userToken;
        const headers = {
          'Authorization': 'Bearer '+ accessToken,
        }

        const response = await axios.get('/api/v1/access/permission/'+id, { headers });

        dispatch(slice.actions.getPermissionSuccess(response.data.data))
      } catch(error) {
        dispatch(slice.actions.hasError(error));
      }
    };
  }