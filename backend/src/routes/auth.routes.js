const {Router}=require('express');
const authController=require('../controller/auth.controller');
const middleware=require('../middleware/auth.middleware')
const router=Router();
/**
 * @route POST/api/auth/register
 * @description Register a new user
 * @ public
 * */
router.post('/register', authController.registerUserController);

/**
 * @route POST/api/auth/login
 * @description login user with email and password
 * @public
 * */

router.post('/login',authController.loginUserController);
/**
 * @route GET/api/auth/logout
 * @description clear token from user cookie and add token in blacklist
 * @public
 * */
 router.get('/logout',authController.logoutUserController);
 /**
 * @route GET/api/auth/get-me
 * @description  check token is valid or not and showing details of user that make request
 * @protected
 * */


 router.get("/test", (req, res) => {
  res.json({ message: "Backend connected successfully!" });
}); //just for checking backend is connected or not


router.get('/get-me',middleware.authCheck,authController.getMeController);
module.exports=router;
