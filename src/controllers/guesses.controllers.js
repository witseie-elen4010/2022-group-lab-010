'use strict'

const game = require('./game.controllers')

const colourCodeGuess = (req, res) => {
    // load request parameters from JSON body
    let post = req.body
    let correctWord = game.getCorrectWord()

    if (!post || !post.guess || post.guess.length !== 5 || !game.wordIsValid(post.guess)) {
        res.status(400).send({
            'message': "The 'guess' parameter is invalid."
        })
        return
    }

    let guess = post.guess.toUpperCase();

   
    let out = {colour: []} // output array

    for(let i = 0; i < post.guess.length; i++){
        let letter = guess.charAt(i)
        
        // Score each letter
        if(letter == correctWord.charAt(i)){
            out.colour.push('green')
        }
        else if(correctWord.indexOf(letter) > -1){
            out.colour.push('yellow')
        }
        else{
            out.colour.push('gray')
        }
    }

    res.setHeader('Content-Type', 'application/json')
    res.send(out)
}

module.exports = { colourCodeGuess }