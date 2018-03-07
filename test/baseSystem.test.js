import World from '../src/world'
import BaseSystem from '../src/baseSystem'

class TestComponent {}

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

  it('restric', () => {
    BaseSystem.restrict({
      add: ['add1', 'add2'],
      remove: ['remove'],
      get: ['get1', 'get2']
    })
    expect(BaseSystem._restrictAdd).toEqual(['add1', 'add2'])
    expect(BaseSystem._restrictRemove).toEqual(['remove'])
    expect(BaseSystem._restrictGet).toEqual(['get1', 'get2'])
  })

  it('removeComponent', () => {
    const world = new World()
    expect(() => {
      BaseSystem.removeComponent('c')
    }).toThrowError(`System did't add to world`)

    BaseSystem.addWorld(world)
    expect(() => {
      BaseSystem.removeComponent('componentName')
    }).toThrowError('Restrict to remove componentName')

    BaseSystem.restrict({
      remove: ['name']
    })
    world.removeComponent = jest.fn()
    BaseSystem.removeComponent('name')
    expect(world.removeComponent).toHaveBeenCalled()
  })

  it('getComponent', () => {
    const world = new World()
    expect(() => {
      BaseSystem.getComponent('c')
    }).toThrowError(`System did't add to world`)

    BaseSystem.addWorld(world)
    expect(() => {
      BaseSystem.getComponent('componentName')
    }).toThrowError('Restrict to get componentName')

    BaseSystem.restrict({
      get: ['name']
    })
    world.addComponent('name', 123)
    expect(BaseSystem.getComponent('name')).toEqual(123)
  })

  it('addComponent', () => {
    const world = new World()
    expect(() => {
      BaseSystem.addComponent('c')
    }).toThrowError(`System did't add to world`)

    BaseSystem.addWorld(world)
    expect(() => {
      BaseSystem.addComponent('componentName')
    }).toThrowError('Restrict to add componentName')

    BaseSystem.restrict({
      add: ['name', 'testComponent']
    })
    world.addComponent = jest.fn()
    BaseSystem.addComponent('name', 123)
    expect(world.addComponent).toHaveBeenCalledWith('name', 123)

    const testComponent = new TestComponent()
    BaseSystem.addComponent(testComponent)
    expect(world.addComponent).toHaveBeenLastCalledWith(testComponent, undefined)
  })
})
