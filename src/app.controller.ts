import {Controller, Request, Post, UseGuards, Get, Session, Res} from '@nestjs/common';
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

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async loginAuth(
      @Request() req,
      @Session() session,
  ) {
    const usuario = await this.usuarioService.encontrarUsuario(req.user.id);
    const carrito = await this.carritoService.buscarCarrito([{estado:"creado",usuario:usuario}]);
    session.carritoActual = carrito[0].id;
    session.usuario = {
      userId: req.user.id,
      roles: req.user.roles.rol
    };
    console.log(session);
    console.log(req.user);
    return this.authService.login(req.user);
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
