const express = require('express');
const productRouter = express.Router();
const productController = require("../controllers/productController")


//productRouter.post('/product',productController.postProduct);

productRouter.get('/getProducts',productController.getProducts);

productRouter.get('/:id',productController.getProduct);


productRouter.put('/:id',productController.updateProduct);

productRouter.delete('/:id',productController.deleteProduct)


module.exports = productRouter;