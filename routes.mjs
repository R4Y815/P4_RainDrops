import { resolve } from 'path';
import multer from 'multer';
// required for multer items
import fs from 'fs';
import util from 'util';
import { uploadFile, getFileStream } from './s3.mjs';

// required for sequelized items
import db from './models/index.mjs';
import initItemsController from './controllers/items.mjs';
import initPhotosController from './controllers/photos.mjs';

// for multer, uploads to s3
const upload = multer({ dest: 'public/uploads/' });
const unlinkFile = util.promisify(fs.unlink);

export default function bindRoutes(app) {
  const ItemsController = initItemsController(db);
  const PhotosController = initPhotosController(db);

  app.get('/items', ItemsController.index);

  // special JS page. Include the webpack index.html file
  app.get('/', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });

  // Upload Photo name route

  // to grab photo based on photo name

  app.get('/photos/:key', (request, response) => {
    const { key } = request.params;
    const readStream = getFileStream(key);

    readStream.pipe(response);
  });

  // uploading photo to AWS S3
  app.post('/upload/photo', upload.single('file'), async (request, response) => {
    /* const { file, body: { name } } = request; */
    const { file } = request;
    console.log(file);
    const result = await uploadFile(file);
    await unlinkFile(file.path);
    console.log(result);
    // when response is sent to server for the photos, server will grab
    // from S3 using the photo/image key
    /* response.send({ imagePath: `/photos/${result.Key}` }); */

    // --> amended to just send imagekey
    response.send({ imageKey: result.Key });
  });

  // Creating new entry in DataBase
  app.post('/newEntry', PhotosController.addNewPhoto);
}
