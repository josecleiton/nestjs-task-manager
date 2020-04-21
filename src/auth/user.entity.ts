import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import * as bcrypt from 'bcryptjs'

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  username: string;
  @Column()
  password: string;

  async validatePassword(password: string): Promise<boolean> {
     return bcrypt.compare(password,this.password);
  }
}
