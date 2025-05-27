import { EntitySchema } from 'typeorm';
import { UserEntity as User } from '../entities';

export const UserSchema = new EntitySchema<User>({
  name: 'User',
  target: User,
  columns: {
    id: {
      type: String,
      primary: true,
      generated: true,
    },
    fullname: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    isSuperUser: {
      type: Boolean,
      default: false,
    },
    authConfirmToken: {
      type: Number,
      default: 123,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
});
