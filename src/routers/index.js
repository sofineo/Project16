const { Router } = require("express")

const usersRouter = require("./users.routes")
const moviesRouter = require("./movies.routes")
const tagsRouter = require("./tags.routes")
const sessionsRouter = require("./sessions.routes")

const routes = Router()

routes.use("/users", usersRouter)
routes.use("/session", sessionsRouter)
routes.use("/notes", moviesRouter)
routes.use("/tags", tagsRouter)

module.exports = routes