var express = require("express"),
    router  = express.Router(),
    Toy     = require("../models/toy");
    
//INDEX - a page showing all toys
router.get("/", function(req, res){
    Toy.find({}, function(err, toys){
      if (err){
          console.log(err);
      } else {
          res.render("toys/toys", {toys: toys});
      } 
    });
    
});

//NEW - a form to create a new toy
router.get("/new", function(req, res){
    res.render("toys/newToy");
});

//CREATE - create a new toy in DB
router.post("/", function(req, res){
    var newToy = {
        name: req.body.name,
        picture: req.body.picture,
        description: req.body.description,
        price: req.body.price
    };
    
    Toy.create(newToy, function(err, newCreatedToy){
        if (err){
            console.log(err);
        } else {
            res.redirect("/toys");
        }
    });
});
//== toy route ==

//SHOW - show a specfic toy page
router.get("/:id", function(req, res){
   Toy.findById(req.params.id).populate("comments").exec(function(err, foundToy){
       console.log("This page's toy: " + foundToy);
       if (err || !foundToy){
           console.log(err);
           return res.redirect("/toys");
       } else {
           res.render("toys/toy", {toy: foundToy});
       }
   }) 
});

module.exports = router;