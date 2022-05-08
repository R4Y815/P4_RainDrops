export default function initPhotosController(db) {
  const addNewPhoto = async (request, response) => {
    try {
      console.log(request.body);
      db.Photo.create(request.body);
      response.send('👍...new Entry added');
    } catch (error) {
      console.log(error);
    }
  };

  const playPhotos = async (request, response) => {
    try {
      console.log(request.params);
      const { key } = request.params;
      let catId;

      // return id number based on emotion keyed in
      switch (key) {
        case 'console':
          catId = 1;
          break;
        case 'family':
          catId = 2;
          break;
        case 'father':
          catId = 3;
          break;
        case 'inspire':
          catId = 4;
          break;
        case 'joy':
          catId = 5;
          break;
        case 'lifepartner':
          catId = 6;
          break;
        case 'lyft':
          catId = 7;
          break;
        case 'motivate':
          catId = 8;
          break;
        case 'reassure':
          catId = 9;
          break;
        case 'recallGoodness':
          catId = 10;
          break;
        case 'silly':
          catId = 11;
          break;
        case 'wonder':
          catId = 12;
          break;
        default:
          catId = 11;
      }

      const gallery = await db.Photo.findAll(
        {
          attributes: [
            'photoName',
            'comment',
            'mood',
            'timePrint',
          ],
          where: {
            categoryId: catId,
          },
        },
      );

      const songs = await db.Song.findAll(
        {
          aattributes: [
            'title',
          ],
          where: {
            categoryId: catId,
          },
        }
      );
      const results = {
          gallery: gallery,
          songs: songs,
          category: key,
        };
      response.send({ results });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    addNewPhoto,
    playPhotos,
  };
}
