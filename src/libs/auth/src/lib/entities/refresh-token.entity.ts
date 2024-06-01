import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { UserEntity as User } from './user.entity';

@Entity({ name: 'refresh_tokens', schema: 'public', synchronize: true })
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'token', nullable: false })
  token!: string;

  @Column({ name: 'expired_at', nullable: false })
  expiredAt!: Date;

  @Column({ name: 'user_id', nullable: false })
  user_id!: string;

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

  @ManyToOne((type) => User, (user) => user.refreshTokens)
  @JoinColumn({name: 'user_id'})
  user!: User;
}
