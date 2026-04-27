const dotenv = require('dotenv');
dotenv.config();
const { Router } = require('express');
const path = require('path');
const authenticate = require('../middleware/authmiddleware');
const authcontroller = require('../controllers/authController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const cartController = require('../controllers/cartController');
const router = Router();
const isAdmin = require('../middleware/admin');
const { getHomeData } = require("../controllers/homeController");
const orderController = require('../controllers/orderController');
const multer = require('../middleware/multer');

//home route

router.get("/home", getHomeData);

//auth routes
router.post("/signup", authcontroller.signUp);
router.post("/signin", authcontroller.signIn);
//app.get('/auth/google',
//    passport.authenticate('google', { scope: ['profile'] }));

//app.get('/auth/google/redirect',
//    passport.authenticate('google', { failureRedirect: '/login' }),
//    function (req, res) {
//        // Successful authentication, redirect home.
//        res.redirect('/');
//    });

//product routes
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/admin/products/add', authenticate, isAdmin, multer.upload.single('image'), productController.createProduct);
router.put('/admin/products/update/:id', authenticate, isAdmin, multer.upload.single('image'), productController.editProduct);
router.delete('/admin/products/delete/:id', authenticate, isAdmin, productController.deleteProduct);

//category routes
router.get('/category', categoryController.getAllCategories);
router.get('/category/:id', categoryController.getCategoryById);
router.post('/admin/category/add', authenticate, isAdmin, multer.upload.single('image'), categoryController.addcategory);
router.put('/admin/category/update/:id', authenticate, isAdmin, multer.upload.single('image'), categoryController.editCategory);
router.delete('/admin/category/delete/:id', authenticate, isAdmin, categoryController.deleteCategory);

//cart routes
router.get('/cart/:userId', authenticate, cartController.getCartByUserId);
router.post('/cart/add', authenticate, cartController.addToCart);
router.delete('/cart/remove/:productId', authenticate, cartController.removeFromCart);
router.put('/cart/update', authenticate, cartController.updateCart);
router.delete('/cart/clear', authenticate, cartController.clearCart);

//order routes
router.get('/orders', authenticate, orderController.getAllOrders);
router.post('/orders/create', authenticate, orderController.createOrder);
router.get('/admin/orders', authenticate, isAdmin, orderController.getOrdersForAdmin);
router.put('/admin/orders/:id/status', authenticate, isAdmin, orderController.updateOrderStatus);
module.exports = router;