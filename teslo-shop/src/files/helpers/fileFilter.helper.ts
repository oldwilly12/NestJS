

export const fileFilter = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {

    // console.log({file});

    if ( !file ) return callback(new Error('File is empty'), false); // false means that the file will be rejected

    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif']; // valid extensions

    if ( validExtensions.includes( fileExtension ) ) {
        return callback(null, true); // true means that the file will be accepted
    }
    
    callback( null, false );

}