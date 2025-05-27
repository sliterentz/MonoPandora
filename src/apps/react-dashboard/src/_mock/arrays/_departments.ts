import _mock from '../_mock';
import { totalEmployees } from '../assets';

export const _departmentList = totalEmployees.map((department, index) => ({
    id: _mock.departmentId(index),
    departmentName: department.name,
    totalEmployees: department.total,
  }));