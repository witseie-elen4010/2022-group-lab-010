'use strict'
/* eslint-env jest */

const jsdom = require('jsdom')
const { JSDOM } = jsdom
const dom = new JSDOM('<!DOCTYPE html><p>Hello world</p>')
console.log(dom.window.document.querySelector('p').textContent) // "Hello world"
global.document = dom.window.document

const keyboard = require('../public/scripts/keyboardLogger')

// import functionToExecute from '../public/scripts/keyboardLogger'

describe('Test Button component', () => {
  it('Test click event', () => {
    const g = document.createElement('input')
    g.id = 'guess'

    document.body.appendChild(g)

    expect(keyboard.functionToExecute('a')).toBe('a')
  })
})
