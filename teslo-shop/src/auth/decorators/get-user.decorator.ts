import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator( // espera un callback una funcion que regresa algo 
    // lo que viene es lo que viene dentro del decorador como argumento
    // ctx: es el contexto en el cual se esta ejecutando nest o funcion en este momento
    // pero mas importante tenemos acceso a la request
    (data: string, ctx: ExecutionContext) => {

        
        
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        // Error 500 porque soy del backend no paso por el gard del usuario
        if ( !user ) {
            throw new InternalServerErrorException('User not found in request');
        } 
        return ( !data ) 
            ? user 
            : user[data]; //regresar usuario con la propiedad computada de la data
    }
);