import axios ,{ AxiosInstance } from "axios";
import { HttpAdapter } from "../interface/http-adapter.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AxiosAdapter implements HttpAdapter {

    private  axios: AxiosInstance = axios;

    async get<T>(url: string): Promise<T> {
        try {

            const { data } = await this.axios.get<T>(url); // T el tipo de dato que se espera
            return data;

        } catch (error) {
            throw new Error(`Error in request ${error.message}`);
        }
    }
}


