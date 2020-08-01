var mongoose = require("mongoose"),
    Toy      = require("./models/toy"),
    Comment  = require("./models/comment");
    
var data = [
        {
            name: "RX-78 MG 3.0",
            picture: "https://images-na.ssl-images-amazon.com/images/I/71zjtHBuXAL._AC_SL1273_.jpg",
            description: "The RX-78-2 Gundam is a fictional manned robot, introduced in 1979 in Yoshiyuki Tomino's and Sunrise's anime series Mobile Suit Gundam.",
            price: "$30"
        },
        {
            name: "Zaku II MG 2.0",
            picture: "https://images-na.ssl-images-amazon.com/images/I/81c2eH2QFOL._AC_SL1500_.jpg",
            description: "The Zaku is a fictional line of manned robots from Mobile Suit Gundam, part of the Universal Century fictional universe, where they are the Principality of Zeon's most commonly fielded Mobile Suits. The most widely known model is the MS-06 Zaku II series.",
            price: "$40"
        },
        {
            name: "Sazabi MG ver KA",
            picture: "https://i.pinimg.com/474x/df/8b/56/df8b5663dda6824bfa078c127e717709--model-kits-gundam.jpg",
            description: "The MSN-04 Sazabi is a mobile suit that appears in Mobile Suit Gundam: Char's Counterattack. It is piloted by Char Aznable.",
            price: "$60"
        },
        {
            name: "Strike PG",
            picture:"https://images-na.ssl-images-amazon.com/images/I/71fg95iHPUL._AC_SL1500_.jpg",
            description: "The GAT-X105 Strike Gundam is a prototype multi-mode mobile suit featured in the anime Mobile Suit Gundam SEED. Its primary pilot was Kira Yamato before it was passed down to former mobile armor ace pilot, Mu La Flaga.",
            price: "$100"
        },
        {
            name: "Freedom MG 2.0",
            picture:"https://images-na.ssl-images-amazon.com/images/I/91uA4x0IfzL._AC_SL1500_.jpg",
            description: "The ZGMF-X10A Freedom Gundam (aka Freedom, X10A) is a mobile suit that appears in the Mobile Suit Gundam SEED and Mobile Suit Gundam SEED Destiny anime. The unit is piloted by Kira Yamato.",
            price: "$130"
        }
    ];   
    
function seedDB(){    
    //remove all toys
    Toy.deleteMany({}, function(err){
      if (err){
          console.log(err);
      } else {
            Comment.deleteMany({}, function(err){
                if (err){
                    console.log(err);
                } else {
                    //create some toys
                //   data.forEach(function(seed){
                //       Toy.create(seed, function(err, toy){
                //           if (err){
                //               console.log(err);
                //           } else {
                //                 addComment(toy);
                //           }
                //       });
                //   });
                }
            });
      }
    });
}




function addComment(toy){
    
    Comment.create({author: "Eason", content: "This is so awesome!"}, function(err, newCreatedComment){
        if (err){
            console.log(err);
        }
        else{
            toy.comments.push(newCreatedComment);
            toy.save(function(err, data){
                if(err){
                    console.log(err);
                } else {
                }
            });
        }
    });
}

module.exports = seedDB;