const knex = require("../database/knex")

class MovieNotesControllers {
  async create(request, response) {
    const { title, description, rating, tags } = request.body
    const { user_id } = request.params

    const [note_id] = await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id,
      created_at: knex.fn.now()
    })

    const tagsInsert = tags.map(name => {
      return {note_id,
      name,
      user_id}
    })

    await knex("movie_tags").insert(tagsInsert)

    return response.status(201).json()
  }

  async update(request, response) {
    const { title, description, rating} = request.body
    const { note_id } = request.params

    await knex("movie_notes").where({ id: note_id }).update({
      title: title ?? note_id.title,
      description: description ?? note_id.description,
      rating: rating ?? note_id.rating,
      updated_at: knex.fn.now()
    })

    return response.status(200).json()
  }

  async index(request, response) {
    const { user_id, title, tags} = request.query

    console.log(tags)
  
    let notes

    if (tags) {
      const filterTags = tags.split(',').map(tag => tag.trim())

      notes = await knex('movie_notes').select([
        "movie_notes.id",
        "movie_notes.title",
        "movie_notes.user_id",
        "movie_notes.rating",
        "movie_tags.name"
      ]).where("movie_notes.user_id", user_id)
      .whereLike("movie_notes.title", `%${title}%`)
      .whereIn("name", filterTags)
      .innerJoin("movie_tags", "movie_tags.note_id", "movie_notes.id",)
      .orderBy("movie_notes.title", "rating")
    } else {
      notes = await knex('movie_notes').select([
        "movie_notes.id",
        "movie_notes.title",
        "movie_notes.user_id",
        "movie_notes.rating",
        "movie_tags.name"
      ]).where("movie_notes.user_id", user_id)
      .whereLike("movie_notes.title", `%${title}%`)
      .innerJoin("movie_tags", "movie_tags.note_id", "movie_notes.id",)
      .orderBy("movie_notes.title", "rating")
    }

    console.log(notes)

    const userTags = await knex("movie_tags").where({user_id})

    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => {tag.note_id === notes.id})
      
      return {
        ...note,
        tags: noteTags
      }
    })


    return response.json({notesWithTags})
  }

  async show(request, response) {
    const { id } = request.params

    const notes = await knex.select().from("movie_notes").where({ id })
    const tags = await knex.select().from("movie_tags").where({ note_id: id})

    return response.json({
      ...notes,
      tags
    })
  }

  async delete(request, response) {
    const { id } = request.params

    await knex('movie_notes').where({id}).delete()

    return response.status(200).json()
  }

}

module.exports = MovieNotesControllers