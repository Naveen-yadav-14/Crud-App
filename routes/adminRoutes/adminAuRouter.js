const adminAuthRouter = require('express').Router();

const adminAuController = require('../../controllers/adminAuController.js');

adminAuthRouter.get('/login',adminAuController.renderLogin);
adminAuthRouter.post('/login',adminAuController.login);
adminAuthRouter.get('/logout',adminAuController.logout);

module.exports = adminAuthRouter;