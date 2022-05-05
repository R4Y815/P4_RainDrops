export default function initPhotosController(db) {
  const addNewPhoto = (request, response) => {
    console.log(request.file);
  };
  return {
    addNewPhoto,
  };
}
