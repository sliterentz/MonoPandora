import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable, BeforeInsert } from 'typeorm';
import { RefreshTokenEntity as RefreshToken } from './refresh-token.entity';
import { PermissionEntity } from './permission.entity';
import { RoleEntity } from './role.entity';

@Entity({ name: 'users', schema: 'public', synchronize: true })
// @Unique(["email"])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  fullname!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ unique: true, nullable: true })
  phone!: string;

  @Column({ nullable: false })
  password!: string;

  @Column({ default: false, nullable: true })
  isSuperUser!: Boolean;

  @Column({ select: false, nullable: true })
  authConfirmToken!: number;

  @Column({ default: false, nullable: true })
  isVerified!: Boolean;

  @Column({ unique: true, default: '', nullable: true })
  username!: string;

  @Column({ default: '', nullable: true })
  company!: string;

  @Column({ default: '', nullable: true })
  avatarUrl!: string;

  @Column({ default: 1 })
  status!: number;

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

  @BeforeInsert()
  setAuthConfirmToken() {
    if (!this.authConfirmToken) {
      this.authConfirmToken = Math.floor(100000 + Math.random() * 900000);
    }
  }

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens!: RefreshToken[];

  @ManyToMany(() => RoleEntity, (role) => role.id, {
    lazy: true,
    cascade: true,
  })

  @JoinTable({
    name: 'users_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles!: Promise<RoleEntity[]>;

  @ManyToMany(() => PermissionEntity, (permission) => permission.id, {
    lazy: true,
    cascade: true,
  })
  
  @JoinTable({
    name: 'users_permissions',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions?: Promise<PermissionEntity[]>;

  constructor(user?: Partial<UserEntity>) {
    super();
    Object.assign(this, user);
  }
}
