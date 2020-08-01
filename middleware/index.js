var Toy     = require("../models/toy"),
    Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkToyOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Toy.findById(req.params.id, function(err, toy){
           if (err){
               req.flash("error", "Toy not found!");
               res.redirect("/toys");
           } else {
               if (toy.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't own this toy!");
                    res.redirect("back");
               }
           }
        });
    }else{
        req.flash("error", "You need to login to do that!");
        res.redirect("back");
    }
}
    
middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to login to do that!");
    res.redirect("/login");
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.commentId, function(err, comment){
           if (err){
               res.redirect("/toys/" + req.params.id);
           } else {
               console.log(comment);
               if (comment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't own this comment!");
                    res.redirect("back");
               }
           }
        });
    }else{
        req.flash("error", "You need to login to do that!");
        res.redirect("back");
    }
}

module.exports = middlewareObj;