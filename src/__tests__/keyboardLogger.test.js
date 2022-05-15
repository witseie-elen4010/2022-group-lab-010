'use strict'
/* eslint-env jest */
const keyboard = require('../public/scripts/keyboardLogger')

// import functionToExecute from '../public/scripts/keyboardLogger'

describe('Test Button component', () => {
  it('Test click event', () => {
    // const mockCallBack = jest.fn()

    // const button = shallow((<button onClick={mockCallBack}>a</button>));
    // const keyElement =
    // button.find('buttonA').simulate('click')
    expect(keyboard.functionToExecute('a')).toBe('a')
  })
  it('Test click event', () => {
    expect(keyboard.functionToExecute('ab')).toBe('a')
  })
})
