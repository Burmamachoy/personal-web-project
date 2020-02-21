import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { Generos } from '../generos/generos.entity';
import {DetalleCarrito} from "../detalle-carrito/detalle-carrito.entity";

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

  @Column({
    type: 'float',
    name: 'precio',
  })
  precio: number;

  @ManyToOne(type => Generos, generos => generos.animes,
)
  generos: Generos;

  @OneToMany(type => DetalleCarrito, detalle => detalle.anime)
  detalle: DetalleCarrito;

}
