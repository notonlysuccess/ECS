import World from '../src/world'
import Tuple from '../src/tuple'
import System from '../src/system'
import BackgroundSystem from '../src/backgroundSystem'
import Entity from '../src/entity'

class TestSystem extends System {
  static update() {}
}

class TestBackgroundSystem extends BackgroundSystem {
  static start() {}

  static stop() {}
}

class TestComponent {
  
}
const getArguments = function() {
  return arguments
}

describe('World Test', () => {
  it('constructor', () => {
    const world = new World()
    expect(world._tuples).toEqual({'': new Tuple([])})
    expect(world._systems).toEqual([])
    expect(world._backgroundSystems).toEqual([])
    expect(world._runStatus).toBeFalsy()
    expect(world._components).toEqual({})
  })

  it('addSystem', () => {
    TestSystem.init = jest.fn()

    const world = new World()
    const returnWorld = world.addSystem(TestSystem)

    expect(returnWorld).toEqual(world)
    expect(TestSystem.init).toHaveBeenCalled()
    expect(TestSystem._world).toEqual(world)
    expect(world._systems.length).toEqual(1)
    expect(world._systems[0]).toEqual(TestSystem)
  })

  it('removeSystem', () => {
    const world = new World()
    world.addSystem(TestBackgroundSystem)
    world.addSystem(TestSystem)
    let returnWorld = world.removeSystem(TestSystem)

    expect(returnWorld).toEqual(world)
    expect(world._systems.length).toEqual(1)
  })

  it('addBackgroundSystem', () => {
    TestBackgroundSystem.init = jest.fn()

    const world = new World()
    const returnWorld = world.addBackgroundSystem(TestBackgroundSystem)

    expect(returnWorld).toEqual(world)
    expect(TestBackgroundSystem.init).toHaveBeenCalled()
    expect(TestBackgroundSystem._world).toEqual(world)
    expect(world._backgroundSystems.length).toEqual(1)
    expect(world._backgroundSystems[0]).toEqual(TestBackgroundSystem)
  })

  it('removeBackgroundSystem', () => {
    const world = new World()
    world.addBackgroundSystem(TestSystem)
    world.addBackgroundSystem(TestBackgroundSystem)
    const returnWorld = world.removeBackgroundSystem(TestBackgroundSystem)

    expect(returnWorld).toEqual(world)
    expect(world._backgroundSystems.length).toEqual(1)
  })

  it('addComponent', () => {
    const world = new World()

    world.addComponent('tag')
    expect(world._components).toEqual({
      tag: true
    })

    world.addComponent('key', 'value')
    expect(world._components).toEqual({
      tag: true,
      key: 'value'
    })
  })

  it('removeComponent', () => {
    const world = new World()
    world.addComponent('testComponent', TestComponent)
    world.removeComponent('testComponent')

    expect(world._components).toEqual({})

    world.removeComponent('unexistComponent')
  })

  it('getComponent', () => {
    const world = new World()
    expect(world.getComponent('unExist')).toBeUndefined()

    world.addComponent('key', 'value')
    expect(world.getComponent('key')).toEqual('value')
  })

  it('addEntity', () => {
    const world = new World()
    const entity = new Entity()

    entity.addToWorld = jest.fn()
    world._tuples[''].addEntityIfMatch = jest.fn()
    const returnWorld = world.addEntity(entity)

    expect(returnWorld).toEqual(world)
    expect(entity.addToWorld).toHaveBeenCalledWith(world)
    expect(world._tuples[''].addEntityIfMatch).toHaveBeenCalledWith(entity)
  })

  it('removeEntity', () => {
    const world = new World()
    const entity = new Entity()

    entity.removeFromWorld = jest.fn()
    world._tuples[''].removeEntity = jest.fn()
    const returnWorld = world.removeEntity(entity)

    expect(returnWorld).toEqual(world)
    expect(entity.removeFromWorld).toHaveBeenCalled()
    expect(world._tuples[''].removeEntity).toHaveBeenCalledWith(entity)
  })

  it('getEntities', () => {
    const world = new World()
    const entity = new Entity()
    entity.addComponent('component1')
    world.addEntity(entity)

    expect(world.getEntities('component1', 'component2')).toEqual({})
    expect(world.getEntities('component1')).toEqual({
      [entity.id]: entity
    })
  })

  it('getEntity', () => {
    const world = new World()
    const entity = new Entity()
    world.addEntity(entity)

    expect(world.getEntity(entity.id)).toEqual(entity)
  })

  it('addEntityToTuples', () => {
    const world = new World()
    const entity = new Entity()
    world._tuples[''].addEntityIfMatch = jest.fn()
    world.addEntityToTuples(entity)
    expect(world._tuples[''].addEntityIfMatch).toHaveBeenCalledWith(entity)
  })

  it('removeEntityFromTuples', () => {
    const world = new World()
    const entity = new Entity()
    world._tuples[''].removeEntityIfNotMatch = jest.fn()
    world.removeEntityFromTuples(entity)
    expect(world._tuples[''].removeEntityIfNotMatch).toHaveBeenCalledWith(entity)
  })

  it('_ensureTupleExists', () => {
    const world = new World()
    const entity1 = new Entity()
    entity1.addComponent('component1')
    const entity2 = new Entity()
    entity2.addComponent('component1')
    entity2.addComponent('component2')
    world.addEntity(entity1)
    world.addEntity(entity2)

    let tuple1 = world._ensureTupleExists(getArguments('component1'))
    expect(tuple1.entities).toEqual({
      [entity1.id]: entity1,
      [entity2.id]: entity2
    })
    expect(world._tuples['component1']).toEqual(tuple1)

    // ensure same tuple again
    tuple1 = world._ensureTupleExists(getArguments('component1'))
    expect(tuple1.entities).toEqual({
      [entity1.id]: entity1,
      [entity2.id]: entity2
    })
    expect(world._tuples['component1']).toEqual(tuple1)

    const tuple2 = world._ensureTupleExists(getArguments('component1', 'component2'))
    expect(tuple2.entities).toEqual({
      [entity2.id]: entity2
    })
    expect(world._tuples['component1,component2']).toEqual(tuple2)

    const tuple3 = world._ensureTupleExists(getArguments('unexistComponent'))
    expect(tuple3.entities).toEqual({})
    expect(world._tuples['unexistComponent']).toEqual(tuple3)
  })

  it('start', () => {
    const world = new World()
    let backgroundSystemStartCount = 0
    TestBackgroundSystem.start = () => {
      ++backgroundSystemStartCount
    }
    world.addBackgroundSystem(TestBackgroundSystem)
    world.start()
    expect(backgroundSystemStartCount).toEqual(1)
    expect(world._runStatus).toBeTruthy()

    // start when world is in running state
    world.start()
    expect(backgroundSystemStartCount).toEqual(1)
  })

  it('update', () => {
    const world = new World()
    System.update = jest.fn()
    world.addSystem(System)

    // update when game isn't start
    world.update()
    expect(System.update).toHaveBeenCalledTimes(0)

    // update when game is running
    world.start()
    world.update(16, 123)
    expect(System.update).toHaveBeenCalledWith(16, 123)
    expect(System.update).toHaveBeenCalledTimes(1)

    // update when game is stopped
    world.stop()
    world.update()
    expect(System.update).toHaveBeenCalledTimes(1)
  })

  it('stop', () => {
    const world = new World()
    TestBackgroundSystem.stop = jest.fn()
    world.addBackgroundSystem(TestBackgroundSystem)

    world.start()
    world.stop()

    expect(world._runStatus).toBeFalsy()
    expect(TestBackgroundSystem.stop).toHaveBeenCalled()
  })

  it('destroy', () => {
    const world = new World()
    const entity = new Entity()
    world.addEntity(entity)
    world.addSystem(TestSystem)
    world.addBackgroundSystem(TestBackgroundSystem)

    TestSystem.destroy = jest.fn()
    TestBackgroundSystem.destroy = jest.fn()

    world.destroy()
    expect(TestSystem.destroy).toHaveBeenCalled()
    expect(TestBackgroundSystem.destroy).toHaveBeenCalled()
    expect(world._tuples).toEqual({'': new Tuple([])})
    expect(world._systems).toEqual([])
    expect(world._backgroundSystems).toEqual([])
    expect(world._runStatus).toBeFalsy()
    expect(world._components).toEqual({})
  })
})
