import Entity from '../src/entity'

describe('Entity Test', () => {
  it('Entity id', () => {
    const entitys = []
    for (let i = 0; i < 10; i ++) {
      entitys.push(new Entity())
    }
    for (let i = 0; i < 10; i ++) {
      expect(entitys[i]._id).toEqual(i)
    }
  })
})
