import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Animes } from '../animes/animes.entity';

@Entity()
export class Generos{

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  publicoPrincipal: string;

  @OneToMany(type => Animes, animes => animes.generos)
  animes: Generos[];

}
