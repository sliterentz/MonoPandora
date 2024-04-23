import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// import BaseEntity from './base.entity';

@Entity({ name: 'users', schema: 'public', synchronize: true })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({ nullable: false })
  fullname!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ nullable: false })
  password!: string

  @Column()
  grant!: number;

  @Column({ select: false, nullable: true })
  authConfirmToken!: String

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
}
