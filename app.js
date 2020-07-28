var express = require("express");
var app = express();

//route: / => Hi there!
app.get("/", function(req, res){
    res.send("Hi there!");
});

app.get("*", function(req, res){
   res.send("Page not found!"); //work for all links that are not defined 
});

//tell Express to listen for request (specify by Cloud9)
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});