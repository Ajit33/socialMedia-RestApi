const express=require("express")
const { getUserController, updateUserController } = require("../controller/userController")
const router=express.Router()


router.get("/:userId",getUserController)
router.put("/update/:userId",updateUserController)




module.exports=router