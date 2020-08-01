var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Comment = require("../models/comment"),
    Toy     = require("../models/toy");
    
//NEW - a page to create a new comment
router.get("/new",  isLoggedIn, function(req, res){
    Toy.findById(req.params.id, function(err, toy){
        if (err){
            console.log(err);
        } else {
            res.render("comments/newComment", {toy: toy});
        }
    });
});

//CREATE - create a new comment in DB
router.post("/", isLoggedIn, function(req, res){
    var newComment = {
        author: req.body.author,
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
                    foundToy.comments.push(newCreatedComment);
                    foundToy.save(function(err, data){
                        if(err){
                            console.log(err);
                        }
                    });
                }
                //redirect to /toys/:id
                res.redirect("/toys/" + req.params.id);
            });
        }
    });
});

//edit a comment in DB
router.post("/:commentId", function(req, res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.content, function(err, content){
       if(err){
          console.log(err);
           res.render("editComment");
       } else {
           Toy.findOne({_id: req.params.id}, function(err, foundToy){
                if (err){
                    console.log(err);
                }else{
                    foundToy.save(function(err, data){
                        if(err){
                            console.log(err);
                        }
                    });
                }
           });
           res.redirect("/toys/" + req.params.id);
       }
   }); 
});

//a page to edit a comment
router.get("/:commentId", function(req, res){
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

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;