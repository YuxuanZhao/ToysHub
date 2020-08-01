var express = require("express"),
    router  = express.Router(),
    User    = require("../models/user"),
    passport= require("passport");


//auth route
//landing page
router.get("/", function(req, res){
    res.render("landing");
});

//show register form
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            req.flash("error", err.message);
            return res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to ToyHubs, " + user.username);
                res.redirect("/toys");
            });
        }
    });
});

//show login 
router.get("/login", function(req, res){
   res.render("login"); 
});

router.post("/login", passport.authenticate("local", {successRedirect: "/toys", failureRedirect: "/login"}), function(req, res){

});

//logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/toys");
});

//handle all others routing
router.get("*", function(req, res){
   res.send("Page not found!"); //work for all links that are not defined 
});

module.exports = router;