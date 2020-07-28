var express = require("express"),
    app     = express();
    
app.use(express.static("pages"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("../pages/landing");
});

app.get("*", function(req, res){
   res.send("Page not found!"); //work for all links that are not defined 
});

//tell Express to listen for request (specify by Cloud9)
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});