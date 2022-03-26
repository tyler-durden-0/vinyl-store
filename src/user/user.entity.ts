import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { VinylEntity } from '../vinyl/vinyl.entity';
import { ReviewEntity } from '../review/review.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  birthDate: string;

  @Column()
  avatar: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: 'null' })
  checkPayment: string;

  @Column({ default: 'null' })
  checkVinylId: string;

  @OneToMany(() => ReviewEntity, (reviews) => reviews.user)
  reviews: ReviewEntity[];

  @OneToMany(() => VinylEntity, (vinyls) => vinyls.user)
  vinyls: VinylEntity[];
}
