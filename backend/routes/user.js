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
} = require("../controller/userController");
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


module.exports = router;
