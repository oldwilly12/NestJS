import { Injectable } from '@nestjs/common';

@Injectable()
export class CarsService {

    private cars = [
        {
            id: 1,
            brand: 'Toyota',
            name: 'Corolla'
        },
        {
            id: 2,
            brand: 'Honda',
            name: 'Civic'
        },
        {
            id: 3,
            brand: 'Jeep',
            name: 'Cherokee'
        }
    ]


    findAll() {
        return this.cars;
    }

    findOne(id: number) {
        return this.cars.find (car => car.id === id);
    }

}
