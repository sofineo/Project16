const { Router } = require('express')

const moviesRouter = Router()
const MovieNotesControllers = require("../controllers/movie_notes.controllers")
const ensureAuthenticated = require('../middleware/ensureAuthenticated')

const movieNotesControllers = new MovieNotesControllers()

moviesRouter.use(ensureAuthenticated)

moviesRouter.post("/", movieNotesControllers.create)
moviesRouter.put("/:note_id", movieNotesControllers.update)
moviesRouter.get("/:id", movieNotesControllers.show)
moviesRouter.get("/", movieNotesControllers.index)
moviesRouter.delete("/:id", movieNotesControllers.delete)

module.exports = moviesRouter