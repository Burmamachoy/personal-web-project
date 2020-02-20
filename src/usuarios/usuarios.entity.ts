import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from './roles.entity';

@Entity()
export class Usuarios{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        name: 'correo',
        length: 256,
        unique: true,
    })
    correo: string;

    @Column({
        type: 'varchar',
        name: 'password',
        length: 32,
    })
    password: string;

    @Column({
        type: 'varchar',
        name: 'salt',
        length: 32,
    })
    salt: string;

    @ManyToOne(type => Roles, roles => roles.usuarios)
    roles: Roles

}
