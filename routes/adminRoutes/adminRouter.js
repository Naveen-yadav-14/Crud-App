const adminController = require("../../controllers/adminController");
const orderController = require("../../controllers/orderController");
const productController = require("../../controllers/productController");

const adminRouter = require("express").Router();

adminRouter.get('/dashboard',adminController.renderDashboard);
adminRouter.get('/allusers',adminController.renderAllUsers);

adminRouter.get("/allproducts", adminController.renderAllProducts);
adminRouter.get('/addproduct', adminController.renderProductPage);
adminRouter.post('/addproduct',adminController.addProduct);

adminRouter.get("/singleproduct/:id",adminController.singleProduct);
adminRouter.post("/updateproduct/:id", adminController.updateProduct);
adminRouter.delete("/deleteproduct/:id",adminController.deleteProduct);
adminRouter.get("/getorders",orderController.getAllOrders);

module.exports = adminRouter;
