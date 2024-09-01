const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  createPostController,
  createPostWithImagesController,
  updatePostController,
} = require("../controller/postController");

router.post("/create", createPostController);
router.post(
  "/create/:userId",
  upload.array("images", 5),
  createPostWithImagesController
);
router.put("/update/:postId",updatePostController)
module.exports = router;
