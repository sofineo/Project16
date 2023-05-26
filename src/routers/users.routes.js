const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const usersRouter = Router()
const upload = multer(uploadConfig.MULTER)

const UserControllers = require("../controllers/users.controllers")
const UserAvatarControllers = require("../controllers/userAvatar.controllers")
const ensureAuthenticated = require("../middleware/ensureAuthenticated")

const userControllers = new UserControllers()
const userAvatarControllers = new UserAvatarControllers()

usersRouter.post("/", userControllers.create)
usersRouter.put("/", ensureAuthenticated, userControllers.update)
usersRouter.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarControllers.update)

module.exports = usersRouter 
