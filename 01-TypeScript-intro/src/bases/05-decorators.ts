class NewPokemon {
    constructor(
        public readonly id: number,
        public name: string,
    ) {}

    scream() {
        console.log(`NO QUIERO!!`);
    }

    speak() {
        console.log(`NO QUIERO HABLAR!!`);
    }
}


const MyDecorator = () => {
    //Regresa una funcion o alguna modificacion
    return ( target: Function ) => {
        // console.log(target);
        return NewPokemon; //Regresa la definicion de la clase
    }
    
}



@MyDecorator()
export class Pokemon {

    constructor(
        public readonly id: number,
        public name: string,
    ) {}

    scream() {
        console.log(`${ this.name.toUpperCase() }!!!`);
    }

    speak() {
        console.log(`${ this.name }, ${ this.name }`);
    }


}

export const charmander = new Pokemon(4, 'Charmander');

//Decoradores son simple funciones que se utilizan de la siguinte manera
// @MyDecorator()

charmander.scream();
charmander.speak();
