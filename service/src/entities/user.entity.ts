import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Photo } from './photo.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName: string;

    @Column()
    password?: string;

    @Column()
    lastName: string;

    @Column({ default: true })
    isActive: boolean;

    // 一对多关系：一个用户可以有多个照片
    @OneToMany(() => Photo, photo => photo.user, {
        cascade: true, // 级联保存、更新、删除
        eager: false, // 默认不加载关联数据
        onDelete: 'CASCADE', // 删除用户时同时删除所有照片
    })
    photos?: Photo[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
