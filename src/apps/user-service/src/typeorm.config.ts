import "reflect-metadata"
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import {User} from "./entities";

dotenv.config();

export const dbdatasource: DataSourceOptions = {
  type: 'postgres' as const,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  port: parseInt(process.env.DB_PORT as string),
  password: process.env.DB_PASS,
  database: process.env.DB_NAME_DEVELOPMENT,
  // url: process.env.DATABASE_URL,
  // entities: ['src/entities/*.entity.ts'],
  entities: [User],
  migrations: ['src/migrations/*.{ts,js}'],
  migrationsRun: process.env.TYPEORM_MIGRATION === 'true',
  migrationsTableName: 'migration',
  synchronize: process.env.TYPEORM_MIGRATION === 'true',
  extra: {
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
  },
};

// const dataSource = new DataSource(dbdatasource);
const dataSource = new DataSource(dbdatasource);
export default dataSource;

