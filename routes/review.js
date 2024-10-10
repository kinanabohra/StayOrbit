const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {reviewLoggedIn,isReviewAuthor,validateReview}=require("../middlware.js")

const reviewController=require("../controllers/reviews.js")

router.post("/",reviewLoggedIn,validateReview,wrapAsync(reviewController.createReview));

router.delete("/:reviewId",reviewLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;