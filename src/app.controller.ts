import {Controller, Request, Post, UseGuards, Get, Session, Res, Query, Req} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import {UsuariosService} from "./usuarios/usuarios.service";
import {CabeceraCarritoService} from "./cabecera-carrito/cabecera-carrito.service";

@Controller()
export class AppController {
  constructor(
      private readonly authService: AuthService,
      private readonly usuarioService: UsuariosService,
      private readonly carritoService: CabeceraCarritoService,
  ) {}

  @Get()
  rutaLogin(
      @Res() res,
      @Query('error')error:string,
      @Query('mensaje')mensaje:string,
  ){
    res.render('login/login-usuarios',{
      datos:{
        error,
        mensaje
      }
    });
  }

  @Get('logout')
  logout(
      @Session() session,
      @Req() req,
      @Res() res,
  ) {
    session.usuario = undefined;
    req.session.destroy();
    res.redirect('/?mensaje=Salio de su sesion con éxito');
  }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async loginAuth(
      @Request() req,
      @Session() session,
      @Res() res,
  ) {
    const usuario = await this.usuarioService.encontrarUsuario(req.user.id);
    const carrito = await this.carritoService.buscarCarrito([{estado:"creado",usuario:usuario}]);
    if(carrito[0]){
      session.carritoActual = carrito[0].id;
    }
    session.usuario = {
      correo: req.user.correo,
      userId: req.user.id,
      roles: req.user.roles.rol
    };
    console.log(session);
    console.log(req.user);
    //return this.authService.login(req.user);
    res.redirect('../generos/mostrar-generos');
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('login')
  login(
      @Res() res,
  ){
    res.render('login/login-usuarios')
  }

}
