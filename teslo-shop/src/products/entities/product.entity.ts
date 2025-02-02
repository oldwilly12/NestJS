import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

@Entity({ name: 'products' }) //nombre de la tabla
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique: true,
    })
    title: string;

    @Column('float', {
        default: 0
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true //acepte valores nulos
    })
    description: string;

    @Column('text',{
        unique: true,
    })
    slug: string;

    @Column('int', {
        default: 0
    })
    stock: number;

    @Column('text', {
        array:true,  //para que sea un array
    })
    sizes: string[];

    @Column('text')
    gender: string;

    @Column('text',{
        array: true,
        default: []
    }
    )
    tags: string[];

    @OneToMany(
        () => ProductImage, //va a regresar un productImage
        (productImage) => productImage.product, // A que quiero que se reliacione
        { cascade: true, eager: true } // ayuda a que si hacemos un insert en product se haga en productImage
    )
    images?: ProductImage[];

    @BeforeInsert()
    checkSlugInsert() {
        if ( !this.slug ) { //this para hacer referencia a la instancia de la clase
            this.slug = this.title          
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(" ", '_')
            .replaceAll("'", '');
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug //se tiene la propiedad slug arriba
            .toLowerCase()
            .replaceAll(" ", '_')
            .replaceAll("'", '');
    }

}


