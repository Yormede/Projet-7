const fs = require("fs");
const Book = require("../models/Book");
const { log } = require("console");

exports.getAllBooks = function (req, res, next) {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = function (req, res, next) {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.getBestRating = function (req, res, next) {
  Book.find({})
    .sort({ rating: -1 })
    .limit(3)
    .then((bestBook) => res.status(200).json(bestBook));
};

exports.postNewBook = function (req, res, next) {
  const receivedBook = JSON.parse(req.body.book);
  delete receivedBook._id;
  delete receivedBook._userId;
  const book = new Book({
    ...receivedBook,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error: error }));
};

exports.updateBook = function (req, res, next) {
  const dataReceived = file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body.book };
  delete dataReceived._userId;
  dataReceived
    .findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Non autorisé" });
      } else {
        book
          .updateOne(
            { _id: req.params.id },
            { ...req.body, _id: req.params.id }
          )
          .then(res.status(200).json({ message: "Livre modifié !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteOneBook = function (req, res, next) {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Non autorisé !" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.postRating = function (req, res, next) {
  console.log(req.params.id);
  const rating = {
    userId: req.body.userId,
    grade: req.body.rating,
  };
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      book.ratings.push(rating);
      const totalRating = book.ratings.length;
      const sumTotalRating = book.ratings.reduce(
        (accumulateur, valeurCourante) => accumulateur + valeurCourante.grade, 0,
      );
      book.averageRating = sumTotalRating / totalRating
      return book.save()
      .then(() => {
        res.status(201).json({ message: "Note enregistré !" })
      })
      .catch((error) => res.status(400).json({ error: error }));
    })
    .catch((error) => res.status(401).json({ error }));
};
