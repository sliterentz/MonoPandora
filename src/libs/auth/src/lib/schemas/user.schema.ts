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
    grant: {
        type: Number,
      },
    authConfirmToken: {
      type: Number,
      default: 123,
    },
    isVerrified: {
      type: Boolean,
      default: true,
    },
  },
});
