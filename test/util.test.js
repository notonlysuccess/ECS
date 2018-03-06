import {
  lowerCamelCase,
  getName
} from '../src/utils'

class ComponentNameTest {
}

describe('Utils test', () => {
  it('lowerCamelCase', () => {
    expect(lowerCamelCase('ABC')).toEqual('aBC')
    expect(lowerCamelCase('abc')).toEqual('abc')
    expect(lowerCamelCase('Abc')).toEqual('abc')
    expect(lowerCamelCase('AbC')).toEqual('abC')
    expect(lowerCamelCase('A-bC')).toEqual('a-bC')
  })

  it('getName', () => {
    expect(getName(ComponentNameTest)).toEqual('ComponentNameTest')
    expect(getName(new ComponentNameTest())).toEqual('ComponentNameTest')
  })
})
