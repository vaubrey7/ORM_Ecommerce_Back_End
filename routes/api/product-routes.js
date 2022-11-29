const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data!!!!
  Product.findAll(
    {
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name']
        },
        {
          model: Tag,
          attributes: ['id', 'tag_name']
        }
      ]
    }
  )
  .then(dbProductData => res.status(200).json(dbProductData))
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
});

// get one product
router.get('/:id', (req, res) => {
  // find a single product by its `id`
  // Again be sure to include its associated Category and Tag data!
  // it will either find it 200. not find it return error message with 404. Or if neither of those happen it catches and gives a 500 err.  
  Product.findOne(
    {
      where: {
        id: req.params.id
      },
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name']
        },
        {
          model: Tag,
          attributes: ['id', 'tag_name']
        }
      ]
    }
  )
  .then(dbProductData => {
    if (!dbProductData) {
      res.status(404).json({ message: 'No product found with this id'});
      return;
    } 
    res.status(200).json(dbProductData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// create new product
router.post('/', (req, res) => {
   Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id,
    tagIDs: req.body.tag_id
  })
    .then((product) => {
      // When there is a product tag, you have to create pairings in order to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
    
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // gets the list of the current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // creates a filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // This function will figure out which productTags to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});
// Do I really Need to go over this one again?
router.delete('/:id', (req, res) => {
  
  Product.destroy(
    {
      where: {
        id: req.params.id
      }
    }
  )
  .then((dbProductData) => {
    if (!dbProductData) {
      res.status(404).json({ message: 'No product found with this id'});
      return;
    }
    res.status(200).json(dbProductData);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  })
});

module.exports = router;