import axios from "axios";

export interface HttpAdapter{
    get<T>( url: string) : Promise<T>;

}

export class PokeApiFetchAdapter implements HttpAdapter{

    async get<T>( url: string ): Promise<T> {
        const resp = await fetch (url);
        const data: T = await resp.json();

        return data;
    }

}


export class PokemonApiAdapter implements HttpAdapter{

    private readonly axios = axios;

    // primer Gnerico por defecto
    async get<T>(url:string) : Promise<T> {
        const { data } = await this.axios.get<T>(url);
        return data;
    }

    // async post(url: string, date: any){

    // }

    // async patch(url: string, date: any){
        
    // }

    // async delete(url: string, date: any){
        
    // }


}