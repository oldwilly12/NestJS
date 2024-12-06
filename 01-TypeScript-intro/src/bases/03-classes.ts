// export class Pokemon {

import axios from "axios";
import { Move, PokeapiResponse } from "../interfaces/pokeapi-response.interface";

    
    //public id: number ;
    //public name: string;

    // el constructor es la funcion o metodo cuando se crea la instancia de la clase
    // or el public before the argument
//     constructor(public id: number, public name: string) {
//         this.id = id;
//         this.name = name;
//         console.log('Constructor de la clase');
//     }


// }

// export const charmander = new Pokemon(10, 'Charmander');



//------------------------------------------------------------------------

// export class Pokemon {

//     get imageUrl():string {
//         //cuando se tgrabja con getter o metodos el this apunta a la instancia ("charmander")
//         return `https://pokemon.com/${ this.id }.jpg`;
//     }

//     constructor(
//         public readonly id: number, 
//         public name: string) 
//         //public imageUrl: string) 
//         {       
//         }

//         //Los metodos una funcion dentro de la clase y con acceso a las propiedades de la clase
//        public scream() {
//             console.log(`${ this.name.toUpperCase() }!!!`);
//             this.speak
//         }

//        private speak() {
//             console.log(`${ this.name }, ${ this.name }`);
            
//         }
// }

// export const charmander = new Pokemon(10, 'Charmander');

// console.log(charmander);

// //charmander.speak();
// charmander.scream();

//------------------------------------------------------------------------

export class Pokemon {

    get imageUrl():string {
        //cuando se tgrabja con getter o metodos el this apunta a la instancia ("charmander")
        return `https://pokemon.com/${ this.id }.jpg`;
    }

    constructor(
        public readonly id: number, 
        public name: string) 
        //public imageUrl: string) 
        {       
        }

        //Los metodos una funcion dentro de la clase y con acceso a las propiedades de la clase
       public scream() {
            console.log(`${ this.name.toUpperCase() }!!!`);
            this.speak
        }

       private speak() {
            console.log(`${ this.name }, ${ this.name }`);
            
        }

        async getMoves(): Promise<Move[]> {
            //const moves = 10;
            const { data } = await axios.get<PokeapiResponse>('https://pokeapi.co/api/v2/pokemon/4');
            
            console.log(data.moves);
            return data.moves;
        }
}

export const charmander = new Pokemon(10, 'Charmander');

// console.log(charmander);

// //charmander.speak();
// charmander.scream();

charmander.getMoves();


