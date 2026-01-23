import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Photo } from './photo.entity';

@Entity()
export class Classify {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    seq: number;

    @Column({ default: true })
    isActive: boolean;
    
    @Column({
        type: "enum",
        enum: ["background", "mask", "material"],
        default: "material"
    })
    type: type

    // 一个分类可以有多张照片
    @OneToMany(() => Photo, photo => photo.classify, {
        cascade: ['insert', 'update'],
        eager: false,
    })
    photos?: Photo[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
export type type = "background" | "mask" | "material";