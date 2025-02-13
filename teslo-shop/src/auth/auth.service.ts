import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly  userRepository : Repository<User>,

    private readonly jwtService: JwtService, // servicio proporcionado nestJwt y por jwtModule este servicio da fecha de expiracion y cuando firmar
  ) {}
async create(createUserDto: CreateUserDto) {
    
    try {

      const { password, ...userData } = createUserDto;
      
      const user = this.userRepository.create( {
        ...userData,
        password: bcrypt.hashSync( password, 10)
      } ); // preparar para actualizar

      await this.userRepository.save( user ); // guarda en la base de datos
      delete user.password; // no devolver la contraseña

      return {
        ...user,
        token: this.getJwtToken({id: user.id})
      };

    } catch (error) {
      console.log(error);
      this.handleDBErrors(error);
    }

  }

  async login( loginUserDto: LoginUserDto ) {
    
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({ 
      where: { email },
      select: { email: true, password: true, id: true }
     });

     if( !user )
      throw new UnauthorizedException('Credentials are not valid (email)');

    if ( !bcrypt.compareSync( password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    return {
      ...user,
      token: this.getJwtToken({id: user.id})
    };



  }

  private getJwtToken( payload: JwtPayload) {

    const token = this.jwtService.sign( payload );
    return token;

  }

  private handleDBErrors( error: any ): never { // este metodo jamas devuelve un valor 

    if (error.code === '23505') 
      throw new BadRequestException(error.detail);
      
    console.log(error);

    throw new BadRequestException('Check server logs');
  }

}
