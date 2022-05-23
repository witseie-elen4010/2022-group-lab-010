require('dotenv').config({ path: '../.env' })
const mongoose = require('mongoose')

const connect = () => {
  // Configure Database connection
  if (process.env.APP_ENV === 'dev') {
    // Assume no login for dev
    const mongoDB = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME
    mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  } else if (process.env.APP_ENV === 'production') {
    // Production uses authentication and SRV
    const mongoDB = 'mongodb+srv://' +
            process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@' +
            process.env.DB_HOST + '/' + process.env.DB_NAME
    mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  }

  const db = mongoose.connection

  db.on('error', console.error.bind(console, 'MongoDB connection error:'))
}

module.exports = {
  connect
}
