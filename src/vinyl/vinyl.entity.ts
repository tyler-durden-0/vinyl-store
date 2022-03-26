import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Review } from '../review/review';
import { ReviewEntity } from '../review/review.entity';
import { UserEntity } from '../user/user.entity';

@Entity()
export class VinylEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  authorName: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  price: number;

  @Column({ default: true })
  canBuy: boolean;

  @OneToMany(() => ReviewEntity, (reviews) => reviews.vinyl)
  reviews: Review[];

  @ManyToOne(() => UserEntity, (user) => user.vinyls)
  user: UserEntity;
}
