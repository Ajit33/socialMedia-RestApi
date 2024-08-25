const express=require("express")
const { getUserController, updateUserController, followUserController, unfollowUserController } = require("../controller/userController")
const router=express.Router()


router.get("/:userId",getUserController)
router.put("/update/:userId",updateUserController)
router.post("/follow/:userId",followUserController)
router.post("/unfollow/:userId",unfollowUserController)



module.exports=router