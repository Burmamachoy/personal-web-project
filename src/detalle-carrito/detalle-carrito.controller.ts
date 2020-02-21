import {Body, Controller, Delete, Get, Param, Post, Put, Query, Res, Session} from '@nestjs/common';
import {DetalleCarritoService} from "./detalle-carrito.service";
import {DetalleCarritoCreateDto} from "./detalle-carrito-create.dto";
import {DetalleCarrito} from "./detalle-carrito.entity";
import {validate} from "class-validator";
import {UsuariosService} from "../usuarios/usuarios.service";
import {CabeceraCarritoService} from "../cabecera-carrito/cabecera-carrito.service";
import { AnimesService } from '../animes/animes.service';

@Controller('detalle-carrito')
export class DetalleCarritoController {
    constructor(
        private readonly detalleCarritoService: DetalleCarritoService,
        private readonly usuarioService: UsuariosService,
        private readonly cabeceraCarritoService: CabeceraCarritoService,
        private readonly animesService: AnimesService,
    ) {
    }

    @Get('crear-detalle/:id')
    async rutaCrearDetalle(
        @Param('id')id:string,
        @Res() res,
        @Query('error')error:string,
    ){
        const anime = await this.animesService.encontrarUno(+id);
        res.render('detalle/crear-detalle',{
            datos:{
                anime,
                error,
            }
        })

    }

    @Get('actualizar-carrito/:id')
    async rutaActualizarCarrito(
        @Param('id')idDetalle:string,
        @Res() res,
        @Query('error')error:string,
    ){
        const detalle = await this.detalleCarritoService.encontrarUno(+idDetalle);
        res.render(
            'carrito/rutas/editar-carrito',
            {
                datos:{
                    detalle,
                    error
                }
            }
        )

    }

    @Post('crear/:idAnime')
    async crearDetalleCarrito(
        @Body('cantidad') cantidad: string,
        @Param('idAnime') idAnime: string,
        @Session() session,
        @Res() res,
    ): Promise<void> {
        const detalleCarritoCreateDto = new DetalleCarritoCreateDto();
        detalleCarritoCreateDto.cantidad = +cantidad;
        detalleCarritoCreateDto.idAnime = +idAnime;
        const errores = await validate(detalleCarritoCreateDto);
        console.error(errores);
        if(errores.length > 0){
            res.redirect('/detalle-carrito/crear-detalle/'+idAnime+'?error=Error validando');
        } else{
            try{
                const usuario = await this.usuarioService.encontrarUsuario(session.usuario.userId);
                const detalleCarrito = new DetalleCarrito();
                const anime = await this.animesService.encontrarAnime(+idAnime);
                detalleCarrito.cantidad = +cantidad;
                detalleCarrito.precio = anime.precio;
                detalleCarrito.anime = anime;
                detalleCarrito.subtotal = this.detalleCarritoService.calcularSubtotal(detalleCarrito.cantidad, detalleCarrito.precio);
                const carritoActual = await this.cabeceraCarritoService.buscarCarrito({estado:"creado",usuario:usuario});
                if(! carritoActual[0]) {
                    detalleCarrito.subtotal = this.detalleCarritoService.calcularSubtotal(detalleCarrito.cantidad, detalleCarrito.precio);
                    await this.detalleCarritoService.crearDetalleCarrito(detalleCarrito);
                    await this.cabeceraCarritoService.crearCabeceraCarrito(usuario, detalleCarrito);
                    const nuevoCarrito = await this.cabeceraCarritoService.buscarCarrito({estado: "creado",usuario:usuario});
                    session.carritoActual = nuevoCarrito[0].id;
                    res.redirect('/generos/mostrar-generos?mensaje=Anime : '+anime.nombre+' agregado al carrito (Carrito Creado)');
                } else{
                    //verificar si existe el detalle
                    const anime = await this.animesService.encontrarAnime(+idAnime);
                    const detalle = await this.detalleCarritoService.buscarDetalles({anime:anime,cabecera:carritoActual[0]});
                    if(detalle.length == 0){
                        carritoActual[0].detalle.push(detalleCarrito);
                        await this.cabeceraCarritoService.actualizarCarrrito(carritoActual[0]);
                        await this.detalleCarritoService.crearDetalleCarrito(detalleCarrito);
                        carritoActual[0].total = this.cabeceraCarritoService.actualizarTotal(carritoActual[0]);
                        await this.cabeceraCarritoService.actualizarCarrrito(carritoActual[0]);
                        res.redirect('/generos/mostrar-generos?mensaje=Anime : '+anime.nombre+' agregado al carrito');
                    }
                    else{
                        res.redirect('/generos/mostrar-generos?mensaje=El Anime: '+anime.nombre+' ya se añadió al carrito');
                    }

                }

            }catch (error){
                res.redirect('/detalle-carrito/crear-detalle/'+idAnime+'?error=Error del Servidor');
            }
        }
    }

    @Post('actualizar/:idAnime/:idDetalle')
    async actualizarDetalleCarrito(
    @Param('idAnime') idAnime: string,
    @Param('idDetalle') idDetalle:string,
    @Body('cantidad') cantidad: string | number,
    @Session() session,
    @Res() res,
    ) {
        const usuario = await this.usuarioService.encontrarUsuario(session.usuario.userId);
        const carritoActual = await this.cabeceraCarritoService.buscarCarrito({estado:"creado",usuario:usuario});
        const anime = await this.animesService.encontrarAnime(+idAnime);
        const detalle = await this.detalleCarritoService.buscarDetalles({anime:anime,cabecera:carritoActual[0]});
        try {
            if(+cantidad > 0) {
                detalle[0].cantidad = +cantidad;
                detalle[0].subtotal = this.detalleCarritoService.calcularSubtotal(detalle[0].cantidad, detalle[0].precio);

                await this.detalleCarritoService.actualizarDetalle(detalle[0]);

                const carritoActual = await this.cabeceraCarritoService.buscarCarrito({estado:"creado",usuario:usuario});
                carritoActual[0].total = this.cabeceraCarritoService.actualizarTotal(carritoActual[0]);
                await this.cabeceraCarritoService.actualizarCarrrito(carritoActual[0]);
                res.redirect('/cabecera-carrito/mostrar-carrito/'+carritoActual[0].id+'?mensaje=Se edito el detalle');
            } else{
                res.redirect('/detalle-carrito/actualizar-carrito/'+idDetalle+'?error=Cantidad menor a 0');
            }
        }catch (e) {
            res.redirect('/detalle-carrito/actualizar-carrito/'+idDetalle+'?error=Error en el servidor');
        }


    }

    @Post('eliminar/:idAnime')
    async  borrarDetalleCarrrito(
        @Param('idAnime') idAnime : string,
        @Session() session,
        @Res() res,
    ) {
        const usuario = await this.usuarioService.encontrarUsuario(session.usuario.userId);
        const carritoActual = await this.cabeceraCarritoService.buscarCarrito({estado:"creado",usuario:usuario});
        const anime = await this.animesService.encontrarAnime(+idAnime);
        const detalle = await this.detalleCarritoService.buscarDetalles({anime:anime,cabecera:carritoActual[0]});

        if(detalle){
            await this.detalleCarritoService.borrarDetalleCarrito(detalle[0].id);
            const carritoActual = await this.cabeceraCarritoService.buscarCarrito({estado:"creado",usuario:usuario});
            carritoActual[0].total = this.cabeceraCarritoService.actualizarTotal(carritoActual[0]);
            await this.cabeceraCarritoService.actualizarCarrrito(carritoActual[0]);
            res.redirect('/cabecera-carrito/mostrar-carrito/'+carritoActual[0].id+'?mensaje=Se elimino el detalle');
        }

    }

}
