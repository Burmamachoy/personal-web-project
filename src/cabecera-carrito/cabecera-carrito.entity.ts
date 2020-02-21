import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Animes} from "../animes/animes.entity";
import {Usuarios} from "../usuarios/usuarios.entity";
import {DetalleCarrito} from "../detalle-carrito/detalle-carrito.entity";

@Entity('cabecera-carrito')
export class CabeceraCarrito{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        name: 'estado',
        length: 32,
    })
    estado: string;

    @Column({
        type: 'timestamp',
        name: 'fecha',
        default: '1970-01-01 00:00:01',
    })
    fecha: Date;

    @Column({
        type: 'float',
        name: 'total',
    })
    total: number;

    @Column({
        type: 'varchar',
        name: 'direccion',
        length: 128,
        default: "No definida",
    })
    direccion: string;

    @ManyToOne(type => Usuarios, usuario => usuario.carritos)
    usuario: Usuarios;

    @OneToMany(type => DetalleCarrito, detalle => detalle.cabecera,{cascade: true
})
    detalle: DetalleCarrito[];

}
