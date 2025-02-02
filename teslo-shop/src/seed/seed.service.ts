import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { CreateProductDto } from '../products/dto/create-product.dto';


@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService // Inject the ProductsService
  ){}
  
  async runSeed() {
    await this.insertNewProducts();
    return 'seed executed';
  }

  private async insertNewProducts() {
    await this.productService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach( product => {
      insertPromises.push( this.productService.create( product ) );
    });

    await Promise.all( insertPromises ); // Wait for all promises to resolve for all products to be inserted

  }
}
