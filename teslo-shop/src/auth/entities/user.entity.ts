
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from '../../products/entities/product.entity';


@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique:true
    })
    email: string;

    @Column('text',{
        select: false //para que no se muestre
    })
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool',{
        default: true
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];


    @OneToMany(
        () => Product, // objeto de la otra entidad
        ( product ) => product.user// instancia del producto y como se relaciona a la otra tabla
    )
    product: Product;


    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }

}
