import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Classify } from './classify.entity';

@Entity("photos")
@Index(['userId', 'createdAt']) // 创建复合索引
export class Photo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column({
        type: "enum",
        enum: ["background", "mask", "material"],
        default: "material"
    })
    type: PhotoType

    @Column()
    userId: number; // 外键列

    // 多对一关系：多个照片属于一个用户
    @ManyToOne(() => User, user => user.photos, {
        onDelete: 'CASCADE', // 用户删除时照片也删除
        nullable: false,
    })
    @JoinColumn({ name: 'userId' }) // 明确指定外键列名
    user: User;

    @Column({ nullable: true })
    classifyId?: number;

    // 多对一关系：多个照片属于一个分类
    // 允许 classifyId 为空，删除分类时把关联照片的 classifyId 置为 NULL
    @ManyToOne(() => Classify, classify => classify.photos, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'classifyId' })
    classify?: Classify;

    @CreateDateColumn()
    createdAt: Date;
    
    @Column({ default: true })
    isActive: boolean;
}
export type PhotoType = "background" | "mask" | "material";