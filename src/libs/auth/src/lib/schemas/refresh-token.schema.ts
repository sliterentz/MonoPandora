import { EntitySchema } from 'typeorm';
import { RefreshTokenEntity as RefreshToken } from '../entities';

export const RefreshTokenSchema = new EntitySchema<RefreshToken>({
  name: 'RefreshToken',
  target: RefreshToken,
  columns: {
    id: {
      type: String,
      primary: true,
      generated: true,
    },
    token: {
     type: String,
    },
    expiredAt: {
      type: String
    },
    user: {
      type: String
    }
  }
})
