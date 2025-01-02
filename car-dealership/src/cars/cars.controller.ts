import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

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
    getCarById( @Param ('id', ParseUUIDPipe ) id: string ) {
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
    createCar( @Body() createCarDto: CreateCarDto ) {
        console.log(createCarDto);
        return this.carsService.create(createCarDto);
    }

    @Patch(':id')
    updateCar(
        @Param ('id', ParseUUIDPipe ) id: string,
        @Body() updateCarDto: UpdateCarDto ) 
        {
        return this.carsService.update( id, updateCarDto);
    }

    @Delete(':id')
    deleteCar( @Param ('id', ParseUUIDPipe ) id: string ) {
        return this.carsService.delete( id );
    }
}
