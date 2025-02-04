import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { fileFilter, fileNamer } from './helpers';



@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}


  @Get('product/:imageName')
  findProductImage(
    @Res() Res: Express.Response, //this is the response object of express
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticProductImage( imageName );

    return path;
  }


  @Post('product') // i want to upload a file for a product, this is add in the URL
  @UseInterceptors( FileInterceptor('file',{
    fileFilter: fileFilter,  // reference to our function
    // limits: { fileSize: 1000 }
    storage: diskStorage({
      destination: './static/products',  // where to store the file
      filename: fileNamer,
    }) 
  }) )
  uploadProductImage( 
    @UploadedFile() file: Express.Multer.File,   // i'll recive a file here 
    ){ 

      if ( !file ) { 
        throw new BadRequestException('Make Shure that the file is an image')
      }; 

      const secureUrl = `${ file.filename }`;
    return {
      secureUrl
    };
  }

}
