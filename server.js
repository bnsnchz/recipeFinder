var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");


var axios = require("axios");
var cheerio = require("cheerio");


var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();


app.use(logger("dev"));

app.use(bodyParser.urlencoded({
    extended: true
}));

var databaseUri = "mongodb://localhost/bonscraper";

if(process.env.MONGODB_URI){
    mongoose.connect(process.env.MONGODB_URI);
}else{
    mongoose.connect(databaseUri);
    }


app.use(express.static("public"));





app.get("/scrape", function (req, res) {

    axios.get("https://www.bonappetit.com/ingredient/steak").then(function (response) {

        var $ = cheerio.load(response.data);

        $("li.component-river-item").each(function (i, element) {

            var result = {};

            result.image = $(this).find("img").attr("srcset").split(" ")[0];
            result.title = $(this).find("h1.feature-item-hed").text();
            result.descrip = $(this).find("p.feature-item-dek").text();
            result.link = "https://www.bonappetit.com" + $(this).find("a").attr("href");
            db.Article.create(result)
                .then(function (dbArticle) {

                    // console.log(dbArticle);
                })
            // .catch(function (err) {

            //     return res.json(err);
            // });
        });


        res.redirect("/recipes.html");
    });
});


app.get("/articles", function (req, res) {

    db.Article.find({})
        .then(function (dbArticle) {

            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});


app.get("/articles/:id", function (req, res) {

    db.Article.findOne({
            _id: req.params.id
        })

        .populate("note")
        .then(function (dbArticle) {

            res.json(dbArticle);
        })
        .catch(function (err) {

            res.json(err);
        });
});


app.post("/articles/:id", function (req, res) {

    db.Note.create(req.body)
        .then(function (dbNote) {

            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                note: dbNote._id
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {

            res.json(dbArticle);
        })
        .catch(function (err) {

            res.json(err);
        });
});


app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});