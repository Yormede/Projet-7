const book = require("../models/Book");

exports.getAllBooks = function (req, res, next) {
  book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = function (req, res, next) {
  book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.getBestRating = function (req, res, next) {
  book.find({ }).sort({rating: -1}).limit(3)
  .then((bestBook) => res.status(200).json(bestBook))
};

exports.postNewBook = function (req, res, next) {
  const receivedBook = JSON.parse(req.body.thing);
  delete receivedBook._id;
  delete thingObject._userId;
  const book = new Book({
    ...receivedBook,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  book.save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error: error }));
};

exports.updateBook = function (req, res, next) {
    book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() =>
        res.status(200).json({ message: "Information du livre modifié !" })
      )
      .catch((error) => res.status(400).json({ error }));
  }

exports.deleteOneBook = function (req, res, next) {
    book.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: "Objet supprimé !" }))
      .catch((error) => res.status(400).json({ error }));
  }

  exports.postRating = function (req, res, next) {
    res.status(201);
    console.log(req.body);
  }
