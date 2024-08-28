const express = require("express");
const {
  getUserController,
  updateUserController,
  followUserController,
  unfollowUserController,
  blockUserController,
  unblockUserController,
  blockListUserController,
  deleteUserController,
  searchUserContoller,
  uploadProfilePictureController,
  uploadCoverPictureController,
} = require("../controller/userController");
const upload = require("../middlewares/upload");
const router = express.Router();

router.get("/:userId", getUserController);
router.put("/update/:userId", updateUserController);
router.post("/follow/:userId", followUserController);
router.post("/unfollow/:userId", unfollowUserController);
router.post("/block/:userId", blockUserController);
router.post("/unblock/:userId", unblockUserController);
router.get("/blocklist/:userId", blockListUserController);
router.delete("/delete/:userId", deleteUserController);
router.get("/search/:query",searchUserContoller)
router.put("/update-profile-picture/:userId",upload.single("profilepicture"),uploadProfilePictureController)
router.put("/update-cover-picture/:userId",upload.single("coverpicture"),uploadCoverPictureController)

module.exports = router;
