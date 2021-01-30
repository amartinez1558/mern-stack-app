const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
  subject: String,
  description: String
})

module.exports = mongoose.model('Post', postSchema)