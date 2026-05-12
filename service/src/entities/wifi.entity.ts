import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
@Index(['userId', 'createdAt']) // 创建复合索引
export class Wifi {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column()
    userId: number; // 外键列

    // 多对一关系：多个照片属于一个用户
    @ManyToOne(() => User, user => user.wifis, {
        onDelete: 'CASCADE', // 用户删除时照片也删除
        nullable: false,
    })
    @JoinColumn({ name: 'userId' }) // 明确指定外键列名
    user: User;

    @CreateDateColumn()
    createdAt: Date;
    
    @Column({ default: true })
    isActive: boolean;
}