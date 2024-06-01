import "reflect-metadata";
import { DataSource, DataSourceOptions } from 'typeorm';
// import { User, RefreshToken } from './entities';
import { RefreshTokenEntity as RefreshToken, UserEntity as User } from "@auth-lib";
import * as dotenv from 'dotenv';

dotenv.config();

export const dbdatasource: DataSourceOptions = {
  type: 'postgres' as const,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  port: parseInt(process.env.DB_PORT as string),
  password: process.env.DB_PASS,
  database: process.env.DB_NAME_DEVELOPMENT,
  // url: process.env.DATABASE_URL,
  entities: [User, RefreshToken],
  // entities: ['../apps/user-service/src/entities/*.entity.ts'],
  migrations: ['../apps/user-service/src/migrations/*.{ts,js}'],
  migrationsRun: process.env.TYPEORM_MIGRATION === 'true',
  migrationsTableName: 'migration',
  synchronize: process.env.TYPEORM_MIGRATION === 'true',
  // extra: {
  //   ssl:
  //     process.env.NODE_ENV === 'production'
  //       ? { rejectUnauthorized: false }
  //       : false,
  // },
};

// const dataSource = new DataSource(dbdatasource);
const dataSource = new DataSource(dbdatasource);
export default dataSource;

