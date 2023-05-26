const { text } = require("express");

exports.up = knex => knex.schema.createTable("users", table => {
  table.increments("id")
  table.string("name")
  table.string("email")
  table.string("password")
  table.text("avatar").useNullasDefault
  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.timestamp('updated_at').defaultTo(knex.fn.now());
})

exports.down =knex => knex.schema.dropTable("users");
