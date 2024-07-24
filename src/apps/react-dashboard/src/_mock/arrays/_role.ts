import _mock from '../_mock';
import { subDays } from 'date-fns';

import { randomNumberRange, randomInArray } from '../utils';

export const _roleList = [...Array(4)].map((_, index) => ({
    id: _mock.id(index),
    // avatarUrl: _mock.image.avatar(index),
    roleName: _mock.roleName(index),
    status: randomInArray(['active', 'disable']),
    createdAt: subDays(new Date(), index),
  }));