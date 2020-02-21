import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {CabeceraCarrito} from "../cabecera-carrito/cabecera-carrito.entity";
import {Animes} from "../animes/animes.entity";

@Entity('detalle-carrito')
export class DetalleCarrito{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'int',
        name: 'cantidad',
        unsigned: true
    })
    cantidad: number;

    @Column({
        type: 'float',
        name: 'precio',
    })
    precio: number;

    @Column({
        type: 'float',
        name: 'subtotal',
    })
    subtotal: number;

    @ManyToOne(type => CabeceraCarrito, cabecera => cabecera.detalle)
    cabecera: CabeceraCarrito;

    @ManyToOne(type => Animes, anime => anime.detalle)
    anime: Animes;
}
