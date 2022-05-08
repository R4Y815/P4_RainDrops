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
  return {
    addNewPhoto,
  };
}
