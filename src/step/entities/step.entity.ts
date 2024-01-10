import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Step extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { comment: '用户id' })
  id: string;
  @Column({ comment: '用户账号' })
  account: string;
  @Column({ comment: '用户密码' })
  password: string;
  @Column({ comment: '用户步数' })
  step: string;
}
