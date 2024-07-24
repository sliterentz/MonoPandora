// import { UnauthorizedException } from '@nestjs/common';
// routes
import { PATH_AUTH } from '../routes/paths';
// utils
import axios from '../lib/utils/axios';


async function jwtExpDecode(token: string) {
  try {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    const response = await axios.get('/api/v1/auth/users');
    const { exp } = response.data;
  
    return exp;
  } catch(error) {
    // throw new UnauthorizedException('Invalid credential');
  }
}


function jwtDecode(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp: number) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;

  const currentTime = Date.now();

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    alert('Token expired');

    localStorage.removeItem('accessToken');

    window.location.href = PATH_AUTH.login;
  }, timeLeft);
};

// ----------------------------------------------------------------------

export const setSession = (accessToken: string | null) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);

    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    // This function below will handle when token is expired
    // const { exp } = jwtDecode(accessToken); // ~3 days by minimals server
    
    // const headers = {
    //   'Authorization': 'Bearer '+ accessToken,
    // }

    // jwtExpDecode(accessToken).then((exp) => {
      // tokenExpired(exp);
    // });
    
  } else {
    localStorage.removeItem('accessToken');

    delete axios.defaults.headers.common.Authorization;
  }
};

// ----------------------------------------------------------------------

export const getToken = (accessToken: string | null) => {
  return localStorage.getItem('accessToken');
}
