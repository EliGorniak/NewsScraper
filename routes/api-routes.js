const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const db = require("../models/index.js");
const app = express();

// Scraping from The Washington Post:
app.get("/scrape", function(req, res) {
  axios
    .get("https://www.washingtonpost.com/")
    .then(function(response) {
      let $ = cheerio.load(response.data);
      //console.log(response.data);
      let result = {};
      $("div.no-skin h2 a").each(function(i, element) {
        const el = $(this);
        console.log(el.text);
        result.title = el.text();
        result.link = el.attr("href");
        console.log(result);

        db.AllArticles.create(result)
          .then(function(dbAllArticles) {
            console.log(dbAllArticles);
            console.log(json);
          })
          .catch(function(err) {
            console.log(err);
            return res.json(err);
          });
      });
      res.send("Scrape done!");
    })
    .catch(function(err) {
      console.log(err);
    });
});

// Route for display all the articles to render in handlebars:
app.get("/articles", function(req, res) {
  db.AllArticles.find({})
    .then(function(results) {
      res.render("index", { articles: results });
    })
    .catch(function(err) {
      // If an error occurred, send it to the user:
      res.json(err);
    });
});

// Route for display all the articles to render in handlebars:
app.get("/", function(req, res) {
  db.AllArticles.find({})
    .then(function(results) {
      res.render("index", { articles: results });
    })
    .catch(function(err) {
      // If an error occurred, send it to the user:
      res.json(err);
    });
});

// Route for display all the saved articles to render in handlebars:
app.get("/saved-articles", function(req, res) {
  db.SavedArticles.find({})
    .populate("articleComments")
    .then(function(articles) {
      res.render("saved", { articles: articles });
    })
    .catch(function(err) {
      // If an error occurred, send it to the user:
      res.json(err);
    });
});

// Route to save an article on database and to delete it from the database:
app.post("/api/save-articles/:id", function(req, res) {
  db.SavedArticles.create({
    title: req.body.title,
    link: req.body.link,
    summary: req.body.summary
  });
  console.log("Article saved!");
  db.AllArticles.remove(
    {
      _id: req.params.id
    },
    function(error, removed) {
      if (error) {
        console.log(error);
        // If an error occurred, send it to the user:
        res.send(error);
      } else {
        console.log("Article deleted!");
      }
    }
  );
});

// Route to update the articles database with new articles and to delete saved articles from the saved database:
app.post("/api/delete-saved-article/:id", function(req, res) {
  db.AllArticles.create({
    title: req.body.title,
    link: req.body.link,
    summary: req.body.summary
  });
  console.log("New article saved!");
  db.SavedArticle.remove(
    {
      _id: req.params.id
    },
    function(error, removed) {
      if (error) {
        console.log(error);
        // If an error occurred, send it to the user:
        res.send(error);
      } else {
        console.log("This article was removed!");
      }
    }
  );
});

// Route to delete some comment in the comments database:
app.post("/api/delete-comment/:id", function(req, res) {
  db.Comment.remove(
    {
      _id: req.params.id
    },
    function(error, removed) {
      if (error) {
        console.log(error);
        // If an error occurred, send it to the user:
        res.send(error);
      } else {
        console.log("removed from saved articles");
        res.send("Comment removed!");
      }
    }
  );
});

// Route to create/update some comment in the comments database:
app.post("/api/comment/:id", function(req, res) {
  db.Comment.create({
    body: req.body.comment
  }).then(function(data) {
    console.log(req.params.id);
    return db.SavedArticle.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { articleComments: data._id } },
      { new: true }
    );
  });
  res.send("Comment created!");
});

module.exports = app;
