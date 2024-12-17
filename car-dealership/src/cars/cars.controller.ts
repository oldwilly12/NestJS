import { Controller, Get, Param } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
    
    constructor(
        private readonly carsService: CarsService
    ){}

    @Get()
    getAllCars() {
        return this.carsService.findAll();
    }

    @Get(':id')
    getCarById( @Param ('id') id: string ) {
        return this.carsService.findOne(+id);
        
        // const id2 = +id 
        // let car = this.cars[id];
        // if ( id2 <= 2 && id2 >= 0 ) {
        //     return car;
        // } else {
        //     return 'Car not found';
        // }
        
    }
}
