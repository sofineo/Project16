const knex = require("../database/knex")

class MovieTagsControllers {
  async create(request, response) {
    const { name } = request.body
    const { note_id } = request.params

    const note = await knex.select().from('movie_notes').where({ id: note_id }).first()

    await knex("movie_tags").insert({
      note_id,
      user_id: note.user_id,
      name
    })

    return response.status(201).json()
  }

  async update(request, response) {
    const { name } = request.body
    const { id } = request.params

    await knex('movie_tags').where({ id }).update({
      name
    })
    return response.status(200).json()
  }

  async index(request, response) {
    const user_id = request.user.id

    const tags = await knex.select().from('movie_tags').where({ user_id})

    return response.json({tags})
  }

  async delete(request, response) {
    const { id } = request.params

    await knex('movie_tags').where({id}).delete()

    return response.status(200).json()
  }

}

module.exports = MovieTagsControllers