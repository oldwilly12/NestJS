import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";


@Entity({ name: 'product_images' }) //nombre de la tabla
export class ProductImage {

    @PrimaryGeneratedColumn() //autoincrementando solo sin el 'uuid'
    id: number;

    @Column('text')
    url: string;

    @ManyToOne(
        () => Product,
        ( Product ) => Product.images,
        { onDelete: 'CASCADE' } // si se borra el producto se borran las imagenes
    )
    product: Product

}