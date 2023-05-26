const { Router } = require('express')

const tagsRouter = Router()
const MovieTagsControllers = require('../controllers/movie_tags.controllers')
const ensureAuthenticated = require('../middleware/ensureAuthenticated')

const movieTagsControllers = new MovieTagsControllers()

tagsRouter.post("/:note_id", movieTagsControllers.create)
tagsRouter.put("/:id", movieTagsControllers.update)
tagsRouter.delete("/:id", movieTagsControllers.delete)
tagsRouter.get("/", ensureAuthenticated, movieTagsControllers.index)


module.exports = tagsRouter