import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles: string[] = this.reflector.get<string[]>(
      'roles',
      context.getHandler()
    );

    if(!roles){
      return true;
    }
    const request = context.switchToHttp().getRequest();
    try {
      const user = request.session.usuario.roles;
      return roles == user;
    }catch{
      throw  new UnauthorizedException();
    }


  }
}
