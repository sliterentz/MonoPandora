import _mock from '../_mock';
import { subDays } from 'date-fns';

import { randomNumberRange, randomInArray } from '../utils';

export const _employeeList = [...Array(24)].map((_, index) => ({
    employeeId: _mock.employeeId(index),
    avatarUrl: _mock.image.avatar(index),
    name: _mock.name.fullName(index),
    email: _mock.email(index),
    phoneNumber: _mock.phoneNumber(index),
    address: '908 Jack Locks',
    country: _mock.address.country(index),
    state: 'Virginia',
    city: 'Rancho Cordova',
    zipCode: '85807',
    company: _mock.company(index),
    isVerified: _mock.boolean(index),
    status: randomInArray(['active', 'banned']),
    position: _mock.position(index),
    joinDate: subDays(new Date(), index),
    gender: _mock.gender(index),
  }));