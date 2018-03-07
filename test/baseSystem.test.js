import World from '../src/world'
import BaseSystem from '../src/baseSystem'

class TestComponent {}
class RemoveSystem extends BaseSystem {
  static _restrictRemove = ['remove']
}
class GetSystem extends BaseSystem {
  static _restrictGet = ['get']
}
class AddSystem extends BaseSystem {
  static _restrictAdd = ['add', 'testComponent']
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
      RemoveSystem.removeComponent('c')
    }).toThrowError(`System did't add to world`)

    RemoveSystem.addWorld(world)
    expect(() => {
      RemoveSystem.removeComponent('unexistComponent')
    }).toThrowError('Restrict to remove unexistComponent')

    world.removeComponent = jest.fn()
    RemoveSystem.removeComponent('remove')
    expect(world.removeComponent).toHaveBeenCalledWith('remove')
  })

  it('getComponent', () => {
    const world = new World()
    expect(() => {
      GetSystem.getComponent('c')
    }).toThrowError(`System did't add to world`)

    GetSystem.addWorld(world)
    expect(() => {
      GetSystem.getComponent('unexistComponent')
    }).toThrowError('Restrict to get unexistComponent')

    world.addComponent('get', 123)
    expect(GetSystem.getComponent('get')).toEqual(123)
  })

  it('addComponent', () => {
    const world = new World()
    expect(() => {
      AddSystem.addComponent('c')
    }).toThrowError(`System did't add to world`)

    AddSystem.addWorld(world)
    expect(() => {
      AddSystem.addComponent('unexistComponent')
    }).toThrowError('Restrict to add unexistComponent')

    world.addComponent = jest.fn()
    AddSystem.addComponent('add', 123)
    expect(world.addComponent).toHaveBeenCalledWith('add', 123)

    const testComponent = new TestComponent()
    AddSystem.addComponent(testComponent)
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
})
