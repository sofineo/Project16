const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")
const knex = require("../database/knex")

class UserControllers {

  async create(request, response){
    const { name, email } = request.body
    let { password } = request.body

    // const database = await sqliteConnection()
    // const checkIfUserExits = await database.get("SELECT * FROM users where email = (?)", [email] )
    const checkIfUserExits = await knex.select().from('users').where({ email }).first() ?? valorDefault
    console.log(checkIfUserExits)

    if (checkIfUserExits) {
      throw new AppError("This email is already in use.")
    }

    const hashedPassword = await hash(password, 8)
    password = hashedPassword

    await knex("users").insert({
      name, 
      email, 
      password})

    return response.status(201).json()
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body
    const { id } = request.params

    const database = await sqliteConnection()
    const user = database.get("SELECT * FROM user WHERE id = (?)", [id])

    if (!user) {
      throw new AppError("User not found!")
    }

    const userWithUpdatedEmail = database.get("SELECT * FROM user WHERE email = (?)", [email])

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

    await database.run(`UPDATE users SET name = ?, email = ?, password = ? updated_at = DATETIME(now') WHERE id = ?`, [user.name, user.email, user.password, id])

    return response.status(200).json()
  }

  index() {}

  show() {}

  delete() {}
}

module.exports = UserControllers