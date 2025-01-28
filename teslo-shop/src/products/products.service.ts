import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService') // crendo propiedad dentro de la clase

  constructor(

    @InjectRepository(Product) //injectar la entidad 
    private readonly productRepository: Repository<Product>,


  ) {}
  
  
  async create(createProductDto: CreateProductDto) {
    
    try {

      const product = this.productRepository.create(createProductDto); // solo lo crea, crea la instancia del producto con sus propiedades
      await this.productRepository.save(product); //guarda el producto en la base de datos

      return product;

    } catch (error) {
      this.handleDBException(error);
      
    }

  }

  findAll( paginationDto: PaginationDto ) {
    const { limit = 10, offset = 0} = paginationDto

    const things = this.productRepository.find({
      take: limit,
      skip: offset,
      // TODO: Relaciones
    });
    return things;
  }

  async findOne(term: string) {
    let product: Product;
    if ( isUUID(term)){
      product = await this.productRepository.findOneBy({id: term});
    } else {
      // product = await this.productRepository.findOneBy({slug: term});
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where(`UPPER(title) = :title or slug =:slug`, {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        }).getOne();
        //select * from product where slug = term or title = term
    }
    // const product = await this.productRepository.findOneBy({id});
    if ( !product ) {
      throw new NotFoundException(`Product with ${term} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.preload({
      id: id, // busca un producto con ese id
      ...updateProductDto // adicionalmente carga todas las propiedades del updateProductDto
      // no actualiza solo prepara para actualizacion 
    });

    if ( !product ) throw new NotFoundException(`Product #${id} not found`);

    try {
      await this.productRepository.save(product);
      return product; // guarda el producto en la base de datos
      
    } catch (error) {
      this.handleDBException(error);
    }


  }

  async remove(id: string) {
    const product = await this.findOne(id);

    await this.productRepository.remove(product);
  }

  private handleDBException( error: any) {
    if (error.code === '23505') {
      throw new BadRequestException('Product already exists');
    }

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
