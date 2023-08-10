const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer");

const booksCtrl = require("../controllers/Books");

router.get("/", booksCtrl.getAllBooks);

router.get("/:id", booksCtrl.getOneBook);

router.get("/bestrating", booksCtrl.getBestRating);

router.post("/", auth, multer, booksCtrl.postNewBook);

router.put("/:id", auth, multer, booksCtrl.updateBook);

router.delete("/:id", auth, booksCtrl.deleteOneBook);

router.post("/:id/rating", auth, booksCtrl.postRating);

module.exports = router;
