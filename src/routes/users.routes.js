const { Router } = require("express")

const usersRouter = Router()
const UserControllers = require("../controllers/users.controllers")

const userControllers = new UserControllers()

usersRouter.post("/", userControllers.create)

module.exports = usersRouter
