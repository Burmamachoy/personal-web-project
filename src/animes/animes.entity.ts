import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AnimesEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()

}
