import {
  lowerCamelCase,
  getName,
  deepCopy
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

  it('deepCopy', () => {
    expect(deepCopy(undefined)).toBeUndefined()
    expect(deepCopy(1)).toEqual(1)
    expect(deepCopy('1')).toEqual('1')
    expect(deepCopy([1, 2, 3])).toEqual([1, 2, 3])
    expect(deepCopy({key: 'value'})).toEqual({key: 'value'})
    expect(deepCopy({arr: [1, 2, 3]})).toEqual({arr: [1, 2, 3]})
  })
})
