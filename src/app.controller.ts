import {Controller, Request, Post, UseGuards, Get, Session} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(
      @Request() req,
      @Session() session,
  ) {
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

}
