import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Unique, OneToMany } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';

@Entity('users')
// @Unique(["email"])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  fullname!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  grant!: number;

  @Column()
  authConfirmToken!: number;

  @Column()
  isVerrified!: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt!: Date;
  
  @OneToMany((type) => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens!: RefreshToken[];
}
