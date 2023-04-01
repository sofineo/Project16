const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")
const knex = require("../database/knex")

class UserControllers {

  async create(request, response){
    const { name, email, password } = request.body

    const checkIfUserExits = await knex.select().from('users').where({ email }).first() //como knex volta um array, colocar first() para voltar o primeiro, caso não exista, será undefined

    if (checkIfUserExits) {
      throw new AppError("This email is already in use.")
    }

    const hashedPassword = await hash(password, 8)

    await knex("users").insert({
      name, 
      email, 
      password: hashedPassword})

    return response.status(201).json()
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body
    const { id } = request.params

    const database = await sqliteConnection()

    const user = await knex.select().from('users').where({ id }).first()

    if (!user) {
      throw new AppError("User not found!")
    }

    const userWithUpdatedEmail = await knex.select().from('users').where({ email }).first()

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("This email is already in use.")
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if (password && !old_password) {
      throw new AppError("Old password must be informed to define a new password") 
    } 
    
    if (password && old_password) {
      const checkedPassword = await compare(old_password, user.password)

      if (!checkedPassword) {
        throw new AppError("Old password is wrong.")
      }

      user.password = await hash(password, 8)
    }

    await knex('users').where(({ id })).update({
      name: user.name,
      email: user.email,
      password: user.password,
      updated_at: knex.fn.now()
    })

    return response.status(200).json()
  }

}

module.exports = UserControllers