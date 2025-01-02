import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Car } from './interfaces/car.interface';
import { CreateCarDto, UpdateCarDto } from './dto';
import { map } from 'rxjs';


@Injectable()
export class CarsService {

    private cars: Car[] = [
        {
            id: uuid(),
            brand: 'Toyota',
            model: 'Corolla'
        },
        {
            id: uuid(),
            brand: 'Honda',
            model: 'Civic'
        },
        {
            id: uuid(),
            brand: 'Jeep',
            model: 'Cherokee'
        }
    ]


    findAll() {
        return this.cars;
    }

    findOne(id: string) {
        const car = this.cars.find (car => car.id === id);

        if ( !car ) throw new NotFoundException(`Car with id '${ id }' not found`);
        

        return car;
    }

    create( CreateCarDto :  CreateCarDto){
        const newCar: Car = {
            id: uuid(),
            ...CreateCarDto
        }

        this.cars.push(newCar);

        return newCar;
    }

    update( id: string, updateCarDto : UpdateCarDto ) {

        let carDB = this.findOne( id );

        this.cars = this.cars.map( car => {

            if ( car.id === id ) {
                carDB = {
                    ...carDB, // esparzo todas las propiedades del objeto carDB
                    ...updateCarDto, // esparzo todas las propiedades del objeto UpdateCarDto que sobreescribe car carDB
                    id, // y si el body tiene un id, lo sobreescribo

                }
                return carDB;
            }

            return car;

        })

        return carDB;

    }

    delete( id: string ) {
        let car = this.findOne( id );

        this.cars = this.cars.filter( car => car.id !== id);

        return this.cars;

    }

}
