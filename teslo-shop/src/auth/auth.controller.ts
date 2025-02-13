import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto){
    return this.authService.login( loginUserDto );
  }0

  @Get('private')
  @UseGuards( AuthGuard() ) // AuthGuard activa la estrategia de passport
  testingPrivateRoute(
    @Req() request: Express.Request
  ) {

    console.log( request );

    return {
      ok: true,
      message: 'Hola mundo private'
    }
  }

 
}
