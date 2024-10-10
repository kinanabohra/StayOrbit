if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const User=require("./models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
require("./googleAauth.js");

const dbUrl=process.env.ATLASDB_URL;
const localDbUrl='mongodb://127.0.0.1:27017/StayOrbit';



const listingRouters=require("./routes/listing.js");
const reviewRouters=require("./routes/review.js");
const userRouters=require("./routes/user.js");


app.set("views",path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine(`ejs`,ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
      secret: process.env.SESSION_SECRET
    },
    touchAfter: 24 * 3600
  });
  store.on("err",()=>{
    console.log("Error in mongo session store",err);
  });

const sessionOptions={
    store,
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expire:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});


main().then(() => {
    console.log("Database connected");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next()
});


app.use("/listings", listingRouters);
app.use("/listings/:id/reviews",reviewRouters);
app.use("/", userRouters);



app.all("*",(req,res,next)=>{
    throw new ExpressError(404,"ERROR:404 ( Page Not Found )");
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Some Error occured"}=err;
    res.status(statusCode).render("./error.ejs",{message});
});




// app.get("/test", async (req, res) => {
    // try {
    //     let sample = new Listing({
    //         title: "villa",
    //         price: 2000,
    //         location: "Goa",
    //         country: "India"
    //     });

    //     await sample.save();
    //     console.log("Data has been inserted");
    //     res.send("Success");
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).send("Failed to insert data");
    // }
// });