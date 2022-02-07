const express = require("express");
const router = express.Router();
const {getAll,getSingle, createFeed, comment, search}  = require("../controllers/feed");
const {protect} = require("../controllers/auth");


router.route("/").get(getAll).post(protect, createFeed);
router.route("/:id").get(getSingle);
router.route("/:id/comment").post(protect,comment);
router.route("/search/:search").get(search);

module.exports = router;

