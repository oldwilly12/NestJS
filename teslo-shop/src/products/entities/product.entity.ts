import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "../../auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' }) //nombre de la tabla
export class Product {

    @ApiProperty({
        example:  '14dd5178-5fba-4852-bf61-2985b9a3e751',
        description: 'Prdocut ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example:  'T-shirt Teslo',
        description: 'Product title',
        uniqueItems: true
    })
    @Column('text',{
        unique: true,
    })
    title: string;

    @ApiProperty({
        example:  0,
        description: 'Prdocut Price',
    })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example:  'Mucho texto para la descripcion',
        description: 'Prdocut Description',
        default: null 
    })
    @Column({
        type: 'text',
        nullable: true //acepte valores nulos
    })
    description: string;

    @ApiProperty({
        example:  't_shirt_teslo',
        description: 'Prdocut SLUG - for SEO',
        uniqueItems: true
    })
    @Column('text',{
        unique: true,
    })
    slug: string;

    @ApiProperty({
        example:  10,
        description: 'Prdocut Stock',
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example:  ['M', 'XL', 'XXL'],
        description: 'Prdocut Sizes',
    })
    @Column('text', {
        array:true,  //para que sea un array
    })
    sizes: string[];

    @ApiProperty({
        example:  'men',
        description: 'Prdocut gender',
        uniqueItems: true
    })
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column('text',{
        array: true,
        default: []
    }
    )
    tags: string[];

    @ApiProperty()
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


