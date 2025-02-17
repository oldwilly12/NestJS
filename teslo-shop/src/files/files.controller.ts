import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Files - Get and Upload')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}


  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response, //Express.Response, // manualy ill emit a response
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticProductImage( imageName );
    
    res.sendFile( path );  // i'll send the file in that path
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

      const secureUrl = `${ this.configService.get('HOST_API') }/files/product/${ file.filename }`;
    return {
      secureUrl
    };
  }

}
