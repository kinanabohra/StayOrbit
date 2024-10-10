const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        filename: {
            type: String,
            default:"listingimage"
        },
        url: {
            type: String,
            default:"https://cdn.pixabay.com/photo/2016/09/07/11/37/tropical-1651423_1280.jpg",
        }
        
    },
    
    price: Number,
    location: String,
    country: String,
    category:{
        type: String,
        enum:["trending","room","iconic-citie","mountain","castle","pool","camping","arctic","farms","dome","boat"]
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});


listingSchema.post("findOneAndDelete",async(lisitng)=>{
    if(lisitng){
        await Review.deleteMany({_id:{$in:lisitng.reviews}})
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
