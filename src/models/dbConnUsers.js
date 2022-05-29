/* 'use strict'

require('dotenv').config({ path: '../.env' })
const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
  } catch (err) {
    console.log(err)
  }
}
module.exports = connectDB
 */
