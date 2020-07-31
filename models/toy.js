var mongoose = require("mongoose");

var toySchema = new mongoose.Schema({
    name: String,
    picture: String,
    description: String,
    price: String,
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
    ]
});

module.exports = mongoose.model("Toy", toySchema);