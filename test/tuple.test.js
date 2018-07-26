import Tuple from '../src/tuple'
import Entity from '../src/entity'

describe('Tuple Test', () => {
  it('constructor and get', () => {
    const componentNames = ['c1', 'c2']
    const tuple = new Tuple(componentNames)
    expect(tuple._componentNames).toEqual(componentNames)
    expect(tuple.entities).toEqual({})
  })

  it('matchEntity', () => {
    const entity1 = new Entity()
    entity1.addComponent('key1')
    const entity2 = new Entity()
    entity2.addComponent('key1')
    entity2.addComponent('key2')
    const entity3 = new Entity()
    entity3.addComponent('key1')
    entity3.addComponent('key2')
    entity3.addComponent('key3')
    const tuple1 = new Tuple(['key1'])
    const tuple2 = new Tuple(['key1', 'key2'])
    const tuple3 = new Tuple(['key1', 'key2', 'key3'])
    expect(tuple1.matchEntity(entity1)).toBeTruthy()
    expect(tuple2.matchEntity(entity1)).toBeFalsy()
    expect(tuple3.matchEntity(entity1)).toBeFalsy()

    expect(tuple1.matchEntity(entity2)).toBeTruthy()
    expect(tuple2.matchEntity(entity2)).toBeTruthy()
    expect(tuple3.matchEntity(entity2)).toBeFalsy()

    expect(tuple1.matchEntity(entity3)).toBeTruthy()
    expect(tuple2.matchEntity(entity3)).toBeTruthy()
    expect(tuple3.matchEntity(entity3)).toBeTruthy()
  })

  it('addEntityIfMatch', () => {
    const tuple = new Tuple(['key1', 'key2'])
    const entity1 = new Entity()
    entity1.addComponent('key1')
    const entity2 = new Entity()
    entity2.addComponent('key1')
    entity2.addComponent('key2')

    tuple.addEntityIfMatch(entity1)
    expect(tuple._entities[entity1.id]).toBeUndefined()

    const returnTuple = tuple.addEntityIfMatch(entity2)
    expect(tuple._entities[entity2.id]).toEqual(entity2)
    expect(returnTuple).toEqual(tuple)
  })

  it('removeEntity', () => {
    const tuple = new Tuple(['key1'])
    const entity = new Entity()
    entity.addComponent('key1')
    tuple.addEntityIfMatch(entity)
    expect(tuple._entities[entity.id]).toEqual(entity)

    const returnTuple = tuple.removeEntity(entity)
    expect(tuple._entities[entity.id]).toBeUndefined()
    expect(returnTuple).toEqual(tuple)

    const entity2 = new Entity()
    tuple.removeEntity(entity2)
  })

  it('removeEntityIfNotMatch', () => {
    const tuple = new Tuple(['key1'])
    const entity = new Entity()
    entity.addComponent('key1')
    tuple.addEntityIfMatch(entity)
    expect(tuple._entities[entity.id]).toEqual(entity)

    entity.removeComponent('key1')
    const returnTuple = tuple.removeEntityIfNotMatch(entity)
    expect(tuple._entities[entity.id]).toBeUndefined()
    expect(returnTuple).toEqual(tuple)

    const entity2 = new Entity()
    tuple.removeEntityIfNotMatch(entity2)
  })
})
