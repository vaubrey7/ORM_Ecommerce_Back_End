const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint yay!

router.get('/', (req, res) => {
  // find all tags
  // WARNING: Make sure to include all the Product data
  Tag.findAll(
    {
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
        }
      ]
    }
  )
  .then(dbTagData => res.status(200).json(dbTagData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // WARNING: make sure to include all the Product data
  Tag.findOne(
    {
      where:{
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
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({ message: 'No tag found with this id'});
      return;
    }
    res.status(200).json(dbTagData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.post('/', (req, res) => {
  // create's a new tag.. are you still reading this? 
  Tag.create(req.body)
    .then((dbTagData) => {
      res.status(200).json(dbTagData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    })
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` it's the same answers over and over and over. 
  Tag.update(req.body,
    {
      where: {
        id: req.params.id
      },
    }
  )
  .then((dbTagData) => {
    if (!dbTagData[0]) {
      res.status(404).json({ message: 'No tag found with this id'});
      return;
    }
    res.status(200).json(dbTagData);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  })
});

router.delete('/:id', (req, res) => {
//...
  Tag.destroy(
    {
      where: {
        id: req.params.id
      }
    }
  )
  .then((dbTagData) => {
    if (!dbTagData) {
      res.status(404).json({ message: 'No tag found with this id' });
      return;
    }
    res.status(200).json(dbTagData);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  })
});

module.exports = router;