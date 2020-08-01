var Toy     = require("../models/toy"),
    Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkToyOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Toy.findById(req.params.id, function(err, toy){
           if (err){
               res.redirect("/toys");
           } else {
               if (toy.author.id.equals(req.user._id)){
                    next();
                } else {
                   console.log("You don't have permission");
                    res.redirect("back");
               }
           }
        });
    }else{
        console.log("need to login first");
        res.redirect("back");
    }
}
    
middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
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
                   console.log("You don't have permission");
                    res.redirect("back");
               }
           }
        });
    }else{
        console.log("need to login first");
        res.redirect("back");
    }
}

module.exports = middlewareObj;