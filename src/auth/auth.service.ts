import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly  usuarioService: UsuariosService,
    private readonly jwtService: JwtService
  ) {
  }

  async validateUser(correo: string, password: string): Promise<any> {
    const user = await this.usuarioService.encontrarUsuarioPorCorreo(correo);
    const passwordHash = this.usuarioService.generarPasswordHash(password, user.salt);
    if(user && user.password == passwordHash){
      const result= user;
      return result;
    }
    return null
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}
