import World from '../src/world'
import BaseSystem from '../src/baseSystem'
import Entity from '../src/entity'

BaseSystem._restrict = true

class TestComponent {
  constructor(value) {
    this.value = value
  }
}
class RemoveSystem extends BaseSystem {
  static _restrictRemove = ['remove']
}
class GetSystem extends BaseSystem {
  static _restrictGet = ['get', 'testComponent']
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

    const testComponent = new TestComponent(123)
    world.addComponent(testComponent)
    GetSystem._useStrict = true
    let returnComponent = GetSystem.getComponent('testComponent')
    returnComponent.value = 234
    expect(testComponent.value).toEqual(123)

    GetSystem._useStrict = false
    returnComponent = GetSystem.getComponent('testComponent')
    returnComponent.value = 234
    expect(testComponent.value).toEqual(234)
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
