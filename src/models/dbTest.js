const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const Word = require('./Word')

module.exports.connect = async () => {
  const mongod = await MongoMemoryServer.create()
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
}
