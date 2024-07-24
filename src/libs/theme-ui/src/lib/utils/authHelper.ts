
import localStorageAvailable from './localStorageAvailable';

interface IProfile {
  fullname: string;
  email: string;
  role: string;
  roles: string[];
  access: string[];
  isVerified: boolean;
}

interface IRole {
  roleName: string
}

export const getCurrentProfile = () => {
  const storageAvailable = localStorageAvailable();
  const userData = storageAvailable ? localStorage.getItem('user') : '';

  if (userData) {
    return userData;
  }
}

export const getCurrentAccess = () => {
  const storageAvailable = localStorageAvailable();
  const userAccess = storageAvailable ? localStorage.getItem('access') : '';

  if (userAccess) {
    const access: IProfile = JSON.parse(userAccess)
    return access;
  }
}

export const getDisplayName = () => {
    const storageAvailable = localStorageAvailable();
    const userProfile = storageAvailable ? localStorage.getItem('user') : '';
  
    if (userProfile) {
      const user: IProfile = JSON.parse(userProfile)
      return user.fullname;
    }
  }
  
export const getRoleName = () => {
    const storageAvailable = localStorageAvailable();
    const roleUser = storageAvailable ? localStorage.getItem('role') : '';
  
    if (roleUser) {
      const role: string = roleUser
      return role;
    }
  }
  
export const getEmail = () => {
    const storageAvailable = localStorageAvailable();
    const userProfile = storageAvailable ? localStorage.getItem('user') : '';
  
    if (userProfile) {
      const user: IProfile = JSON.parse(userProfile)
      return user.email;
    }
  }

export const getVerifiedStatus = () => {
    const storageAvailable = localStorageAvailable();
    const userProfile = storageAvailable ? localStorage.getItem('user') : '';
  
    if (userProfile) {
      const user: IProfile = JSON.parse(userProfile)
      return user.isVerified;
    }
  }