import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
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
    getCarById( @Param ('id', ParseIntPipe) id: number ) {
        console.log({ id });
        return this.carsService.findOne( id );
        
        // const id2 = +id 
        // let car = this.cars[id];
        // if ( id2 <= 2 && id2 >= 0 ) {
        //     return car;
        // } else {
        //     return 'Car not found';
        // }
        
    }


    @Post()
    createCar( @Body() body: any ) {
        console.log(body);
        return body;
    }

    @Patch(':id')
    updateCar(
        @Param ('id', ParseIntPipe) id: number,
        @Body() body: any ) 
        {
        console.log(body);
        return body;
    }

    @Delete(':id')
    deleteCar( @Param ('id', ParseIntPipe) id: number ) {
        return {
            method: 'DELETE',
            id
        }
    }
}
