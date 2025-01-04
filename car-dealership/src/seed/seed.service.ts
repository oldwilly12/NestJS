import { Injectable } from '@nestjs/common';
import { CarsService } from 'src/cars/cars.service';
import { CARS_SEED } from './data/cars.seed';
import { BRANDS_SEED } from './data/brands.seed';
import { BrandsService } from 'src/brands/brands.service';


@Injectable()
export class SeedService {
 
  constructor(
    private readonly carsService: CarsService,
    private readonly brandService: BrandsService,
  ){}

  populateDB() {

    // CARS_SEED
    // BRANDS_SEED
    this.carsService.fillCarsWithSeedData( CARS_SEED );
    this.brandService.fillCarsWithSeedData( BRANDS_SEED );

    return 'Seed executed';


  }

}
