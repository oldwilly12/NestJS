import { IsString } from "class-validator";




export class CreateCarDto {

   // @IsString()
   // readonly id: string;

   @IsString()
   readonly brand: string;

   @IsString()
   readonly model: string;

}

