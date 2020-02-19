import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Usuarios{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        name: 'correo',
        length: 256,
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

}
