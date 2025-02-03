import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { fileFilter, fileNamer } from './helpers';



@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

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

      console.log(file);

    return {
      fileName: file.originalname
    };
  }

}
