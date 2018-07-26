import World from '../src/world'
import BaseSystem from '../src/baseSystem'
import Entity from '../src/entity'

BaseSystem._restrict = true

class TestComponent {
  constructor(value) {
    this.value = value
  }
}

describe('BaseSystem test', () => {
  beforeEach(() => {
    BaseSystem.clear()
  })

  it('addWorld', () => {
    const world = new World()
    BaseSystem.addWorld(world)
    expect(BaseSystem._world).toEqual(world)
  })

  it('function check', () => {
    BaseSystem.init()
    BaseSystem.destroy()
  })

  it('removeComponent', () => {
    const world = new World()
    expect(() => {
      BaseSystem.removeComponent('c')
    }).toThrowError(`System did't add to world`)

    BaseSystem.addWorld(world)

    world.removeComponent = jest.fn()
    BaseSystem.removeComponent('remove')
    expect(world.removeComponent).toHaveBeenCalledWith('remove')

  })

  it('getComponent', () => {
    const world = new World()
    expect(() => {
      BaseSystem.getComponent('c')
    }).toThrowError(`System did't add to world`)

    BaseSystem.addWorld(world)

    expect(BaseSystem.getComponent('c')).toBeUndefined()

    world.addComponent('test', 123)
    expect(BaseSystem.getComponent('test')).toEqual(123)
  })

  it('addComponent', () => {
    const world = new World()
    expect(() => {
      BaseSystem.addComponent('c')
    }).toThrowError(`System did't add to world`)

    BaseSystem.addWorld(world)

    world.addComponent = jest.fn()
    BaseSystem.addComponent('add', 123)
    expect(world.addComponent).toHaveBeenCalledWith('add', 123)

    const testComponent = new TestComponent()
    BaseSystem.addComponent(testComponent)
    expect(world.addComponent).toHaveBeenLastCalledWith(testComponent, undefined)
  })

  it('getEntities', () => {
    const world = new World()
    expect(() => {
      BaseSystem.getEntities('c')
    }).toThrowError(`System did't add to world`)

    BaseSystem.addWorld(world)
    world.getEntities = jest.fn()
    BaseSystem.getEntities('a', 'b')
    expect(world.getEntities).toHaveBeenCalledWith('a', 'b')
  })

  it('getEntity', () => {
    const world = new World()
    expect(() => {
      BaseSystem.getEntity(1)
    }).toThrowError(`System did't add to world`)

    BaseSystem.addWorld(world)
    const entity = new Entity().addComponent('a')
    world.addEntity(entity)
    const entityId = entity.id
    expect(BaseSystem.getEntity(entityId)).toEqual(entity)
    expect(BaseSystem.getEntity(-1)).toEqual(undefined)
  })

  it('addEntity', () => {
    const world = new World()
    expect(() => {
      BaseSystem.addEntity('c')
    }).toThrowError(`System did't add to world`)

    BaseSystem.addWorld(world)
    world.addEntity = jest.fn()
    BaseSystem.addEntity('a')
    expect(world.addEntity).toHaveBeenCalledWith('a')
  })

  it('removeEntity', () => {
    const world = new World()
    expect(() => {
      BaseSystem.removeEntity('c')
    }).toThrowError(`System did't add to world`)

    BaseSystem.addWorld(world)
    world.removeEntity = jest.fn()
    BaseSystem.removeEntity('a')
    expect(world.removeEntity).toHaveBeenCalledWith('a')
  })
})
