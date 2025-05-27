import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn  } from 'typeorm';

@Entity({ schema: 'public', name: 'permissions', synchronize: true })
export class PermissionEntity extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
    id!: number;
    
    @Column({ name: 'permissionName', nullable: false, unique: true, length: 50 })
    permissionName!: string;
    
    @Column({ name: 'description', nullable: false, length: 250 })
    description!: string;
    
    @Column({ name: 'status', nullable: false, default: 1, })
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

    constructor(permission?: Partial<PermissionEntity>) {
        super();
        Object.assign(this, permission);
    }
}