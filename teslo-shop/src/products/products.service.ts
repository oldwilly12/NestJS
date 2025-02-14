import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { validate as isUUID } from 'uuid';
import { ProductImage, Product } from './entities';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService') // crendo propiedad dentro de la clase

  constructor(

    @InjectRepository(Product) //injectar la entidad 
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage) //injectar la entidad 
    private readonly productImageRepository: Repository<ProductImage>,

    
    private readonly dataSource: DataSource, // sabe la cadena de datos que usamos 

  ) {}
  
  
  async create(createProductDto: CreateProductDto, user: User) {
    
    try {
      const { images = [], ...productDetails} = createProductDto; //...productDetails guarda el resto ahi y que no son imagenes

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map( image => this.productImageRepository.create({ url: image})), // cap 146
        user// == user: user // usuario que es el tipo usuario del parametro
      }); // solo lo crea, crea la instancia del producto con sus propiedades
      await this.productRepository.save(product); //guarda el producto en la base de datos

      return {...product, images: images};

    } catch (error) {
      this.handleDBException(error);
      
    }

  }

  async findAll( paginationDto: PaginationDto ) {
    const { limit = 10, offset = 0} = paginationDto

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      // TODO: Relaciones
      relations: { // relaciones que se quieren traer
        images: true,
      }
    });
    // return products.map( product => ({
    //   ...product,
    //   images: product.images.map( img => img.url)
    // }));
    return products.map( ({ images, ...rest }) => ({
      ...rest,
      images: images.map( img => img.url)
    }));
  }

  async findOne(term: string) {
    let product: Product;
    if ( isUUID(term)){
      product = await this.productRepository.findOneBy({id: term});
    } else {
      // product = await this.productRepository.findOneBy({slug: term});
      const queryBuilder = this.productRepository.createQueryBuilder('prod'); //'prod' es el alias de tabla principal productos
      product = await queryBuilder
        .where(`UPPER(title) = :title or slug =:slug`, {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images','prodImages') // prod.images es la relacion que se quiere traer
        .getOne();
        //select * from product where slug = term or title = term
    }
    // const product = await this.productRepository.findOneBy({id});
    if ( !product ) {
      throw new NotFoundException(`Product with ${term} not found`);
    }
    return product;
  }
  
  async findOnePlain( term: string ) { // aplanar
    const {images = [], ...rest} = await this.findOne(term);
    return {
      ...rest,
      images: images.map( image => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    // toUpdate es un objeto que contiene todas las propiedades del updateProductDto excepto images y se actualiza
    const { images, ...toUpdate } = updateProductDto; 

    //haz un preload de un objeto qu elusca asi el id y actualiza los datos que hay en el preload
    const product = await this.productRepository.preload({ id, ...toUpdate });        
    
    if ( !product ) throw new NotFoundException(`Product #${id} not found`);

    // Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect(); // conecta a la base de datos
    await queryRunner.startTransaction(); // inicia la transaccion

    try {

      if ( images ) {
        await queryRunner.manager.delete(ProductImage, { product: { id }}); // elimina las imagenes que estan asociadas al producto
        product.images = images.map( 
          image => this.productImageRepository.create({ url: image })//crar instanicas de mi imagen sin impactar en la base de datos       
      ) 
      } else {
        // product.images ???
      }
      // await this.productRepository.save( product );
      product.user = user;
      await queryRunner.manager.save(product)

      // dar commit a la transaccion decir que ya lo haga 
      await queryRunner.commitTransaction();
      await queryRunner.release(); // con esto paramos el queryRunner 

      //await this.productRepository.save(product); // intenta guardarlo 
      return this.findOnePlain( id ); // guarda el producto en la base de datos
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
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

  // trabajar seed y borrar todo
  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product'); // alias product 

    try {
      return await query
      .delete()
      .where({})
      .execute();


    } catch (error) {
      this.handleDBException(error);
    }
  }

}
