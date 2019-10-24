const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const allArticlesSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String
  }
});

let AllArticles = mongoose.model("AllArticles", allArticlesSchema);

module.exports = AllArticles;
