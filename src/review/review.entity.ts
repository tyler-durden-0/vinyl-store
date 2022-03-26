import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { VinylEntity } from '../vinyl/vinyl.entity';
import { UserEntity } from '../user/user.entity';

@Entity()
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @Column()
  score: number;

  @Column()
  authorName: string;

  @ManyToOne(() => UserEntity, (user) => user.reviews)
  user: UserEntity;

  @ManyToOne(() => VinylEntity, (vinyl) => vinyl.reviews)
  vinyl: VinylEntity;
}
