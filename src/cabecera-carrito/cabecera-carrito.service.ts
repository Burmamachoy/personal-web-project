import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {CabeceraCarrito} from "./cabecera-carrito.entity";
import {Repository} from "typeorm";
import {DetalleCarrito} from "../detalle-carrito/detalle-carrito.entity";
import {Usuarios} from "../usuarios/usuarios.entity";

@Injectable()
export class CabeceraCarritoService {
    constructor(
        @InjectRepository(CabeceraCarrito)
        private _repositorioCabeceraCarrito: Repository<CabeceraCarrito>
    ) {
    }

    crearCabeceraCarrito(usuario: Usuarios, detalleCarrito: DetalleCarrito){
        const cabeceraCarrito = new CabeceraCarrito();
        cabeceraCarrito.usuario = usuario;
        cabeceraCarrito.detalle = [detalleCarrito];
        cabeceraCarrito.total = detalleCarrito.subtotal;
        cabeceraCarrito.estado = "creado";
        return this._repositorioCabeceraCarrito
            .save<CabeceraCarrito>(cabeceraCarrito)
    }

    actualizarTotal(cabeceraCarrito: CabeceraCarrito): number{
        let total  = 0;
        function subtotal(detalleCarrito: DetalleCarrito){
            return detalleCarrito.subtotal
        }
        cabeceraCarrito.detalle.forEach(
            detalleCarrito => total += subtotal(detalleCarrito)
        );
        console.log("Total :" + total);
        return total;
    }

    encontrarCabeceraCarrito(id: number): Promise<CabeceraCarrito | undefined>{
        return this._repositorioCabeceraCarrito
            .findOne(id)
    }

    actualizarCarrrito(
        cabeceraCarrito: CabeceraCarrito){
        return this._repositorioCabeceraCarrito
            .save(cabeceraCarrito)
    }

    buscarCarrito(
        where:any = {},
        skip = 0,
        take = 10,
        order: any = {
            id: 'DESC',
        }
    ) : Promise<CabeceraCarrito[]>{
        return this._repositorioCabeceraCarrito
            .find(
                {
                    relations: ["detalle"],
                    where: where,
                    skip: skip,
                    take: take,
                    order: order,
                })
    }

}
