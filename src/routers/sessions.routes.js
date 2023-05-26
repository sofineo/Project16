const { Router } = require("express")

const sessionRouter = Router()
const SessionController = require("../controllers/session.controllers")

const sessionController = new SessionController()

sessionRouter.post("/", sessionController.create)

module.exports = sessionRouter