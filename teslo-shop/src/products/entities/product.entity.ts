import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "../../auth/entities/user.entity";

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

    @ManyToOne(
        () => User,// se va a relacionar con la entidad de user
        ( user ) => user.product, // si tengo un usuario como sabe como relacionarse a la otra tabla
        { eager: true } // cada que se haga consulta para los productos carge la relacion con usuario
    )
    user: User;


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


