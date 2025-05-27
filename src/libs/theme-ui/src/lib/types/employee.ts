export type IEmployeeGeneral = {
    employeeId: string;
    avatarUrl: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    country: string;
    state: string;
    city: string;
    zipCode: string;
    company: string;
    isVerified: boolean;
    status: string;
    position: string;
    joinDate: Date | number;
    resignDate: Date | number;
    gender: string;
  };