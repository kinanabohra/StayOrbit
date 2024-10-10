const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const passport = require("passport");
const {isLoggedIn,saveRedirectUrl}=require("../middlware.js")



const userController=require("../controllers/users.js")



router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));


router.get('/auth/google/callback', 
    passport.authenticate('google', 
        { failureRedirect: '/signup',failureFlash: true  }),
        userController.login);


router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signUp));


router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",
    { failureRedirect:"/login", failureFlash:true}),
    userController.login);


router.get("/logout",userController.logout);

router.get("/profile",isLoggedIn,(req,res,next) => {
    res.render("./user/profile.ejs",);
})


module.exports=router;