const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");

module.exports.reviewLoggedIn=async(req,res,next)=>{
    if(!req.isAuthenticated()){
        const listing= await Listing.findById(req.params.id);
        req.session.redirectUrl=`/listings/${listing._id}`
        req.flash("error","You must be signed in first!")
       return res.redirect(`/listings/${listing._id}`);
    }
    next()
};

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be signed in first!")
       return res.redirect("/login");
    }
    next()
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the owner of the listing");
        return res.redirect(`/listings/${listing._id}`);  
    }
    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the author of the review");
        return res.redirect(`/listings/${id}`);  
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    let {listing}=req.body;
    let {error} = listingSchema.validate(listing);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}