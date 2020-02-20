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
        type: 'int',
        name: 'precio',
    })
    precio: number;

    @Column({
        type: 'int',
        name: 'subtotal',
    })
    subtotal: number;

    @Column({ nullable: true})
    cabeceraId: number;

    @ManyToOne(type => CabeceraCarrito, cabecera => cabecera.detalle)
    @JoinColumn()
    cabecera: CabeceraCarrito;

    @Column({ nullable: true})
    animeId: number;

    @ManyToOne(type => Animes, anime => anime.detalle)
    @JoinColumn()
    anime: Animes;

}
