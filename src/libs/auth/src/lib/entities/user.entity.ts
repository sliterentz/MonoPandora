import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Unique, OneToMany } from 'typeorm';
import { RefreshTokenEntity as RefreshToken } from './refresh-token.entity';

@Entity({ name: 'users', schema: 'public', synchronize: true })
// @Unique(["email"])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  fullname!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ nullable: false })
  password!: string;

  @Column()
  grant!: number;

  @Column({ select: false, nullable: true })
  authConfirmToken!: number;

  @Column({ default: false, nullable: true })
  isVerrified!: Boolean;

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
