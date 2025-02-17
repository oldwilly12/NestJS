import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  //obtener metadata
  //reflector perimite ver inormacion de los decoradores o metadata del mismo mtodo o donde este puesto

  constructor(
    private readonly reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler()); // ''roles' es el nombre de la metadata

    if ( !validRoles ) return true;
    if ( validRoles.length === 0 ) return true;
    // ctx == ExecutionContext == context
    const req = context.switchToHttp().getRequest();
        const user = req.user as User;

      if(!user) {
        throw new BadRequestException('User not found');
      }

      for (const role of user.roles) {
        if (validRoles.includes( role )) {
          return true;
        }
      }

      throw new ForbiddenException(
        `User with roles ${ user.fullName } need a valid role: [${ validRoles }]`
      );

    //console.log({userRoles: user.roles});
    //console.log({validRoles});

    

    return true;
  }
}
