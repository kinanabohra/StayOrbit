const User=require("../models/user.js");

module.exports.renderSignUpForm=(req, res) => {
    res.render("./user/signup.ejs");
};

module.exports.signUp=async(req,res)=>{
    try{
    let {email,username,password}=req.body;
    email = email.toLowerCase();
    username = username
    let newUser = new User({email,username});
    let resgisteredUser=await User.register(newUser,password);
    req.login(resgisteredUser,(err)=>{
        if(err){
            return next(err); 
        }
        req.flash("success","WellCome to StayOrbit");
        res.redirect("/listings");
    })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup"); 
    }  
};

module.exports.renderLoginForm=(req, res) => {
    res.render("./user/login.ejs");
};

module.exports.login=(req, res) => {
    req.flash("success","WellCome Back to StayOrbit");
    const redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next) => {
    req.logout((err)=>{
        if(err){
            return next(err); 
        }
    req.flash("success","Logout Successfully");
    res.redirect("/listings")
    })
}


