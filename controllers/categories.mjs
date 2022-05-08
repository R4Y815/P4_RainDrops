export default function initCategoriesController(db) {
  const index = async (request, response) => {
    try {
      const allCategories = await db.Category.findAll(
        {
          attributes: [
            'id',
            'name',
          ],
          order: [['id', 'ASC']],
        },
      );
      response.send({ allCategories });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
  };
}
