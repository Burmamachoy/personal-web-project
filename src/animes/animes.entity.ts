import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Generos } from '../generos/generos.entity';

@Entity()
export class Animes{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  anioLanzamineto: number;
  
  @Column()
  estudio: string;

  @Column()
  numeroEpisodios: number;

  @Column()
  director: string;

  @ManyToOne(type => Generos, generos => generos.animes)
  generos: Generos;

  


}
