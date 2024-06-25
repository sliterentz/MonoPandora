
import localStorageAvailable from './localStorageAvailable';

interface IProfile {
    displayName: string;
    email: string;
    role: number;
    isVerified: boolean;
  }

export const getDisplayName = () => {
    const storageAvailable = localStorageAvailable();
    const userProfile = storageAvailable ? localStorage.getItem('user') : '';
  
    if (userProfile) {
      const user: IProfile = JSON.parse(userProfile)
      return user.displayName;
    }
  }
  
export const getRoleName = () => {
    const storageAvailable = localStorageAvailable();
    const userProfile = storageAvailable ? localStorage.getItem('user') : '';
  
    if (userProfile) {
      const user: IProfile = JSON.parse(userProfile)
      if (user.role === 0) {
        return 'Admin';
      } else if (user.role === 1) {
        return 'Supervisor';
      } else if (user.role === 2) {
        return 'Employee';
      } else {
        return 'Client';
      }
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