require("express-async-errors")
const AppError = require("./utils/AppError")

const express = require("express")

const database = require("./database/sqlite")

const routes = require("./routers")

const app = express()
app.use(express.json())
app.use(routes)

database()

app.use((error, request, response, next ) => {
  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    })
  }

  //debug purpose
  console.log(error)

  return response.status(error.statusCode).json({
    status: "error",
    message: "Internal server error"
  })
})

const PORT = 3333
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))