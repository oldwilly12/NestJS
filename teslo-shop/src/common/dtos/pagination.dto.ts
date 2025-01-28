import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @Type(() => Number) //para que lo convierta a numero "enableImplicitConversion: true" en el main.ts
    limit?: number;

    @IsOptional()
    @Type(() => Number)
    @Min(0) 
    offset?: number;

}
