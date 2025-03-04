import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import {Post} from "../posts/post.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  provider: string;

  @Column({ unique: true })
  providerId: string;

  @OneToMany(() => Post, (post) => post.author, { cascade: true })
  posts: Post[];
}
