const adminController = require("../../controllers/adminController");
const orderController = require("../../controllers/orderController");
const planController = require("../../controllers/planController");
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
adminRouter.delete('/orders/delete/:id',orderController.deleteOrder);
adminRouter.post('/orders/update/:id',orderController.updateOrderStatus);

adminRouter.get("/add-plan",adminController.renderPlanPage);
adminRouter.post('/add-plan',planController.addPlan);
adminRouter.get('/allplans',planController.renderAllPlans);
adminRouter.delete('/delete-plan/:id',planController.deletePlan);
adminRouter.post('/update-plan/:id',planController.updatePlan);

adminRouter.get('/checkout',adminController.renderCheckoutPage);
adminRouter.get('/subscribed-user',adminController.renderSubscribedUser)

module.exports = adminRouter;
