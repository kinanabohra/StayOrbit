const Listing = require("../models/listing.js");

module.exports.index=async(req, res) => {
    const allListing= await Listing.find({}).populate("owner");
    res.render("./listing/index.ejs",{allListing});
};

module.exports.renderNewForm=(req, res) => {
    res.render("./listing/new.ejs");
};

module.exports.showListing=async(req, res) => {
    let {id}=req.params;
    const listing= await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    if(!listing){
    req.flash("error","Listing you requested does not exist!");
    res.redirect("/listings")
    }else{
    res.render("./listing/show.ejs",{listing});
    }
}

module.exports.createListing=async(req, res) => {
    let {path,filename}=req.file;
    let {title,description,category,price,country,location}=req.body;

        let newListing =new Listing({
            title: title,
            description: description,
            image:{
                url:path,
                filename
            },
            category:category,
            price:price,
            country: country,
            location: location,
            owner:req.user._id,
        });

        await newListing.save();
        req.flash("success","New Listing Created!");
        res.redirect("/listings");   
};

module.exports.renderEditForm=async(req, res) => {
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
    req.flash("error","Listing you requested does not exist!");
    res.redirect("/listings")
    }else{
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_300");
    res.render("./listing/edit.ejs",{listing,originalImageUrl})
    };
};

module.exports.updateListing=async(req, res) => {
    let {title,description,price,country,location}=req.body;
    let {id}=req.params;
    let Updatedlisting= await Listing.findByIdAndUpdate((id),{
        title: title,
        description: description,
        price:price,
        country: country,
        location: location  
    },{new:true},{runValidator:true});
    if (typeof req.file!=="undefined"){
        let {path,filename}=req.file;
        Updatedlisting.image.url=path;
        Updatedlisting.image.filename=filename;
    }
    await Updatedlisting.save();
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${Updatedlisting._id}`);
};

module.exports.destroyListing=async(req, res) => {
    let {id}=req.params;
    const Deletedlisting= await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings")
};

module.exports.filterListing=async(req,res)=>{
    let {value:filter}=req.params;
     let allListing=await Listing.find({category:filter}).populate("owner"); 
     res.render("./listing/index.ejs",{allListing});
};