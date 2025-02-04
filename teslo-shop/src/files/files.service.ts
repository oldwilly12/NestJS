import { join } from 'path';

import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';


@Injectable()
export class FilesService {
  
    getStaticProductImage( imageName: string ) {

        const path = join( __dirname, '../../static/products', imageName ); // where does the image excitst in the server

        if ( !existsSync ( path ) ) {
            throw new BadRequestException(`No product image found with image ${ imageName }`);

        }

        return path; 
        
    }

}
