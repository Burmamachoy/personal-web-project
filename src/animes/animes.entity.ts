import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Generos } from '../generos/generos.entity';

@Entity()
export class Animes{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    name: 'nombre',
    length: 32,
  })
  nombre: string;

  @Column({
    type: 'int',
    name: 'anioLanzamiento',
    unsigned: true,
  })
  anioLanzamiento: number;
  
  @Column({
    type: 'varchar',
    name: 'estudio',
    length: 32,
  })
  estudio: string;

  @Column({
    type: 'int',
    name: 'numeroEpisodios',
    unsigned: true,
  })
  numeroEpisodios: number;

  @Column({
    type: 'varchar',
    name: 'director',
    length: 32
  })
  director: string;

  @ManyToOne(type => Generos, generos => generos.animes)
  generos: Generos;

  


}
