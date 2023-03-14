const express = require("express")
const app = express()

const PORT = 3333


app.get("/", (request, response) => {
  
})

app.listen(PORT, () => (`Server is running on Port ${PORT}`))