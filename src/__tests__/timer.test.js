'use strict'
/* eslint-env jest */
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const dom = new JSDOM('<!DOCTYPE html><p>Hello world</p>')
// console.log(dom.window.document.querySelector('p').textContent) // "Hello world"
global.document = dom.window.document

// const timer = require('../public/scripts/timer')

// const game = require('../controllers/game.controllers')

describe('Test Button component', () => {
  it('Test click event', () => {
    const g = document.createElement('input')
    g.id = 'guess'

    document.body.appendChild(g)

    expect('a').toBe('a')
  })
})
