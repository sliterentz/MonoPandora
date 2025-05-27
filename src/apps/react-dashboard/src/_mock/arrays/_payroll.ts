import _mock from '../_mock';
import { subDays } from 'date-fns';

import { randomNumberRange, randomInArray } from '../utils';

export const _payrollList = [...Array(24)].map((_, index) => ({
    employeeId: _mock.employeeId(index),
    avatarUrl: _mock.image.avatar(index),
    name: _mock.name.fullName(index),
    email: _mock.email(index),
    phoneNumber: _mock.phoneNumber(index),
    salary: _mock.salary(index),
    isVerified: _mock.boolean(index),
    status: randomInArray(['draft', 'pending', 'processing', 'paid']),
    position: _mock.position(index),
    joinDate: subDays(new Date(), index),
    gender: _mock.gender(index),
  }));