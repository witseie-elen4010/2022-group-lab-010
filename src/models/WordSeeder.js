const Word = require('./Word')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const cliProgress = require('cli-progress')
require('dotenv').config({ path: '../../.env' })

process.on('SIGINT', () => {
  console.log('Caught interrupt signal')
  process.exit()
})

if (mongoose.connection.readyState === 0) {
  const mongoDB = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME
  console.log('Connecting to: ', mongoDB)
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
}

mongoose.connection.on('error', () => {
  console.error.bind(console, 'MongoDB connection error:')
  process.exit(1)
})

// Assumes mongoose is connected
const file = fs.readFileSync(path.join(__dirname, 'dictionary.json'))
const dict = JSON.parse(file)
const total = dict.length

console.log('Dropping Existing Dictionary...')
Word.collection.drop()

console.log('Seeding Dictionary...')

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
bar.start(total, 0)
const wordDict = []
dict.forEach(element => {
  wordDict.push({ word: element })
})

const seedDictionary = async () => {
  const chunkSize = 100
  for (let i = 0; i < total - 1; i += chunkSize) {
    const chunk = wordDict.slice(i, i + chunkSize)
    await Word.insertMany(chunk)
      .then(bar.update(i + chunk.length))
      .catch((error) => {
        if (error.code !== 11000) { console.error(error) }
      })
  }
}

seedDictionary()
  .then(() => {
    bar.stop()
    console.log('Seeded Successfully!')
    process.exit()
  })
