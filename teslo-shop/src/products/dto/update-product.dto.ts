// import { PartialType } from '@nestjs/mapped-types'; se dejo para la documentadcion y mejor se usa swagger
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
