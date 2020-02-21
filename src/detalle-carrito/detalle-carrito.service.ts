import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DetalleCarrito} from "./detalle-carrito.entity";
import {DeleteResult, FindOneOptions, Repository} from "typeorm";
import {CabeceraCarrito} from "../cabecera-carrito/cabecera-carrito.entity";
import {Animes} from "../animes/animes.entity";

@Injectable()
export class DetalleCarritoService {
    constructor(
        @InjectRepository(DetalleCarrito)
        private _repositorioDetalleCarrito: Repository<DetalleCarrito>
    ) {
    }

    crearDetalleCarrito(detalleCarrito: DetalleCarrito){
        return this._repositorioDetalleCarrito
            .save<DetalleCarrito>(detalleCarrito);
    }

    borrarDetalleCarrito(id: number): Promise<DeleteResult>{
        return this._repositorioDetalleCarrito
            .delete({id});
    }

    calcularSubtotal(cantidad: number, precio: number): number{
        return cantidad * precio;
    }

    actualizarDetalle(
        detalleCarrito: DetalleCarrito
    ): Promise<DetalleCarrito>{
        return this._repositorioDetalleCarrito
            .save(detalleCarrito)
    }

    buscarDetalles(
        where: any = {},
        skip = 0,
        take = 10,
        order: any = {
            id: 'ASC',
        }
    ) : Promise<DetalleCarrito[]>{

        return this._repositorioDetalleCarrito
            .find(
                {
                    relations: ["anime"],
                    where: where,
                    skip: skip,
                    take: take,
                    order: order,
            })
    }

    encontrarDetalleCarrito(id: number): Promise<DetalleCarrito | undefined>{
        return this._repositorioDetalleCarrito
            .findOne(id)
    }

    encontrarUno(id: number): Promise<DetalleCarrito | undefined> {
        const options: FindOneOptions<DetalleCarrito> ={
            where : {id:id},
            relations : ["anime"]
        };
        return this._repositorioDetalleCarrito.findOne(options);
    }

}
