import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Usuarios } from './usuarios.entity';

@Entity()
export class Roles{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    name: 'rol',
    length: 32,
  })
  rol: string;

  @OneToMany(type => Usuarios, usuarios => usuarios.roles)
  usuarios: Usuarios[];

}
