import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from "@nestjs/common";

import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { Repository } from "typeorm";

/**
 * JWTStrategy
 * Es una clase que esta flotando en mi poyecto
 * todas las estrategias son providers
 * en auth.module como es un provider hay que agregarlo como provider
 * providers: [JwtStrategy]
 * Tb en exportar porque en otros modulos hay que evaluar o usar en otros lugares
 */

// PassportStrategy revisara el token basado en la palabra secreta y tb si no ha expirado
@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {


    constructor(
        @InjectRepository(User) //entidad que maneja eeste repositorio 
        private readonly userRepository: Repository<User>,
        
        ConfigService: ConfigService // es necesario tenerlo en auth.module
    ) {
        // passportstrategy necesita llamar al padre constructor del padre
        super({
            secretOrKey: ConfigService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // posicion del token, posicion del header postman BearerToken 
        });
    }

    //funcion para validar el payload (si esta activo)
    async validate ( payload: JwtPayload ): Promise<User> {

        const { id } = payload;

        const user = await this.userRepository.findOneBy({ id });

        if ( !user )
            throw new UnauthorizedException('Token not valid');

        if( !user.isActive )
            throw new UnauthorizedException('User is Inactive, talk with an admin');

        console.log({user});
        
        return user;
    }
    
}