const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const booksRoutes = require("./routes/Books")
const authRoutes = require("./routes/Auth") 

mongoose
  .connect(
    "mongodb+srv://admin69:y39MCmJwrdyOnBGi@ahmiweb.zjmxhx1.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());

app.use("/api/books", booksRoutes)
app.use("/api/auth/", authRoutes)
app.use("/images", express.static(path.join(__dirname,"images")));

module.exports = app;
