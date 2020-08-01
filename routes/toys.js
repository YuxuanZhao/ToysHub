var express = require("express"),
    router  = express.Router(),
    Toy     = require("../models/toy"),
    middleware = require("../middleware");
    
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
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("toys/newToy");
});

//CREATE - create a new toy in DB
router.post("/", middleware.isLoggedIn, function(req, res){
    var newToy = {
        name: req.body.name,
        picture: req.body.picture,
        description: req.body.description,
        price: req.body.price,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };
    
    Toy.create(newToy, function(err, newCreatedToy){
        if (err){
            console.log(err);
        } else {
            req.flash("success", "Successfully added toy!");
            res.redirect("/toys");
        }
    });
});
//== toy route ==

//SHOW - show a specfic toy page
router.get("/:id", function(req, res){
   Toy.findById(req.params.id).populate("comments").exec(function(err, foundToy){
       if (err || !foundToy){
           console.log(err);
           return res.redirect("/toys");
       } else {
           res.render("toys/toy", {toy: foundToy});
       }
   }) 
});

//Edit toy route
router.get("/:id/edit", middleware.checkToyOwnership, function(req, res){
    Toy.findById(req.params.id, function(err, toy){
        res.render("toys/editToy", {toy: toy});
    });
});

//Update toy route
router.put("/:id", middleware.checkToyOwnership, function(req, res){
    Toy.findOneAndUpdate({_id: req.params.id}, req.body.toy, {upsert: true, useFindAndModify: false}, function(err, updatedToy){
        if (err){
            console.log(err);
            res.redirect("/toys");
        } else {
            res.redirect("/toys/" + req.params.id);
        }
    });
});

//Destroy toy route
router.delete("/:id", middleware.checkToyOwnership, function(req, res){
    Toy.findByIdAndRemove(req.params.id, {useFindAndModify: false}, function(err){
        if (err){
            res.redirect("/toys");
        } else {
            res.redirect("/toys");
        }
    });
});



module.exports = router;