import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService, // Inject the ProductsService

    @InjectRepository( User )
    private readonly userRepository: Repository<User>
  ){}
  
  async runSeed() {
    await this.deleteTables();

    await this.insertNewProducts();
    return 'seed executed';
  }

  private async deleteTables(){

    await this.productService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
    .delete()
    .where({}) // Delete all users sin condicion
    .execute()

  }

  private async insertUsers() {

    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach( user => {
      users.push(this.userRepository.create( user)) // preapara 
    });

    await this.userRepository.save( seedUsers );


  }


  private async insertNewProducts() {
    await this.productService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    // products.forEach( product => {
    //   insertPromises.push( this.productService.create( product ) );
    // });

    await Promise.all( insertPromises ); // Wait for all promises to resolve for all products to be inserted

  }
}
