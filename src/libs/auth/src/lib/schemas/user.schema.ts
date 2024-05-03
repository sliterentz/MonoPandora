import { EntitySchema } from 'typeorm';
import { UserEntity } from '../entities';

export const UserSchema = new EntitySchema<UserEntity>({
  name: 'User',
  target: UserEntity,
  columns: {
    id: {
      type: Number,
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
