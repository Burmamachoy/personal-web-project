import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Animes } from '../animes/animes.entity';

@Entity()
export class Generos{

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    name: 'nombre',
    length: 32,
  })
  nombre: string;

  @Column({
    type: 'varchar',
    name: 'descripcion',
    length: 256,
  })
  descripcion: string;

  @Column({
    type: 'varchar',
    name: 'publicoPrincipal',
    length: 32,
  })
  publicoPrincipal: string;

  @OneToMany(type => Animes, animes => animes.generos)
  animes: Animes[];

}
