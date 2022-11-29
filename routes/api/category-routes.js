const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include the Products!!!
  Category.findAll(
    {
      include: [
        {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
        }
      ]
    }
  )
  .then(dbCategoryData => res.status(200).json(dbCategoryData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.get('/:id', (req, res) => {
  // find a category by its `id` value
  //again be sure to include its Products!
  Category.findOne(
    {
      where: {
        id: req.params.id
      },
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
        }
      ]
    }
  )
    .then(dbCategoryData => {
      if (!dbCategoryData) {
        res.status(404).json({ message: 'No category found with this id'});
        return;
      }
      res.status(200).json(dbCategoryData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  });

router.post('/', (req, res) => {
  // create a new category
  Category.create(req.body)
    .then((dbCategoryData) => {
      res.status(200).json(dbCategoryData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
  // update a category by its `id` 
  Category.update(req.body,
    {
      where: {
        id: req.params.id
      }
    }
  )
  .then((dbCategoryData) => {
    if (!dbCategoryData[0]) {
      res.status(404).json({ message: 'No category found with this id'});
      return;
    }
    res.status(200).json(dbCategoryData);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  })
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` I mean it literaly says delete(`/:id, ) the other ones sure they may need an explaining but this.. anyway it then finds and deletes with 200 or the ID isn't found and display the erorr message and in the case that neither of those things happen it catches with a 500 err
  Category.destroy(
    {
      where: {
        id: req.params.id
      }
    }
  )
  .then((dbCategoryData) => {
    if (!dbCategoryData) {
      res.status(404).json({ message: 'No category found with this id' });
      return;
    }
    res.status(200).json(dbCategoryData);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  })  
});

module.exports = router;