var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Comment = require("../models/comment"),
    Toy     = require("../models/toy"),
    middleware = require("../middleware");
    
//NEW - a page to create a new comment
router.get("/new", middleware.isLoggedIn, function(req, res){
    Toy.findById(req.params.id, function(err, toy){
        if (err){
            console.log(err);
        } else {
            res.render("comments/newComment", {toy: toy});
        }
    });
});

//CREATE - create a new comment in DB
router.post("/", middleware.isLoggedIn, function(req, res){
    var newComment = {
        author: {
            id: req.user._id,
            username: req.user.username
        },
        content: req.body.content
    };
    
    Comment.create(newComment, function(err, newCreatedComment){
        if (err){
            console.log(err);
        }
        else{
            Toy.findOne({_id: req.params.id}, function(err, foundToy){
            
                if (err){
                    console.log(err);
                } else {
                    // newCreatedComment.author.id = req.user._id;
                    // newCreatedComment.author.username = req.user.username;

                    foundToy.comments.push(newCreatedComment);
                    foundToy.save(function(err, data){
                        if(err){
                            console.log(err);
                        }
                    });
                }
                req.flash("success", "Successfully added comment!");
                //redirect to /toys/:id
                res.redirect("/toys/" + req.params.id);
            });
        }
    });
});

//edit a comment in DB
router.put("/:commentId", middleware.checkCommentOwnership, function(req, res){
    Comment.findOneAndUpdate({_id: req.params.commentId}, {content: req.body.content}, {upsert: true, useFindAndModify: false}, function(err, updatedComment){
        if (err){
            console.log(err);
        }
        res.redirect("/toys/" + req.params.id);
    });
});

//a page to edit a comment
router.get("/:commentId/edit", middleware.checkCommentOwnership, function(req, res){
    Toy.findById(req.params.id).populate("comments").exec(function(err, foundToy){
        if (err || !foundToy){
            console.log(err);
        } else {
            Comment.findById(req.params.commentId, function(err, comment){
                if (err){
                    console.log(err);
                } else{
                    res.render("comments/editComment", {toy: foundToy, comment: comment});
                }
            });
        }
    });
});

//Destroy comment route
router.delete("/:commentId", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if (err){
            res.redirect("/toys/" + req.params.id);
        } else {
            res.redirect("/toys/" + req.params.id);
        }
    });
});

module.exports = router;