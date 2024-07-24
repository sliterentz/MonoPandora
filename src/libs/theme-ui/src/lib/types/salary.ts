export type ISalaryGeneral = {
    employeeId: string;
    avatarUrl: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    isVerified: boolean;
    status: string;
    position: string;
    joinDate: Date | number;
    resignDate: Date | number;
    salary: number;
  };