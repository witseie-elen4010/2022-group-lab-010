const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const Word = require('./Word')
const User = require('./User')

let mongod
module.exports.connect = async () => {
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()

  await mongoose.connect(uri)
}

module.exports.seed = async () => {
  const dict = ['mouse', 'house', 'smart', 'pizza']

  const wordDict = []
  dict.forEach(element => {
    wordDict.push({ word: element })
  })

  await Word.insertMany(wordDict)

  const user = { username: 'TestUser' }
  await User.create(user)
}

module.exports.close = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongod.stop()
}