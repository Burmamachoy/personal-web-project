import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import { jwtConstants } from './constants';
import {IJwtPayload} from "./jwt-payload.interface";
import {UsuariosService} from "../usuarios/usuarios.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
      private readonly usuariosService: UsuariosService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: IJwtPayload) {
    const { username } = payload;
    const usuario = await this.usuariosService.encontrarUsuarioPorCorreo(username);

    if(! await usuario){
      throw  new UnauthorizedException();
    }

    payload.roles = usuario.roles['rol'];

    return { userId: payload.sub, username: payload.username, roles: payload.roles};
  }
}
