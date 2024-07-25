import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
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

  @ManyToOne(() => User, (user) => user.refreshTokens)
  @JoinColumn({name: 'user_id'})
  user!: User;
}
