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
    const returnWorld = world.addComponent(TestComponent)

    expect(returnWorld).toEqual(world)
    expect(world.testComponent).toEqual(TestComponent)

    const testComponent = new TestComponent()
    world.addComponent(testComponent)
    expect(world.testComponent).toEqual(testComponent)

    world.addComponent('tag')
    expect(world.tag).toBeTruthy()

    world.addComponent('key', 'value')
    expect(world.key).toEqual('value')
  })

  it('removeComponent', () => {
    const world = new World()
    world.addComponent(TestComponent)
    const returnWorld = world.removeComponent('TestComponent')

    expect(returnWorld).toEqual(world)
    expect(world.testComponent).toBeUndefined()

    world.removeComponent('unexistComponent')
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

    const tuple2 = world._ensureTupleExists(getArguments('component1', 'Component2'))
    expect(tuple2.entities).toEqual({
      [entity2.id]: entity2
    })
    expect(world._tuples['component1,Component2']).toEqual(tuple2)

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
    let systemUpdateCount = 0
    System.update = (dt, now) => {
      expect(dt).toEqual(16)
      expect(now).toEqual(123)
      ++systemUpdateCount
    }
    world.addSystem(System)

    // update when game isn't start
    world.update(16, 123)
    expect(systemUpdateCount).toEqual(0)

    // update when game is running
    world.start()
    world.update(16, 123)
    expect(systemUpdateCount).toEqual(1)

    // update when game is stopped
    world.stop()
    world.update(16, 123)
    expect(systemUpdateCount).toEqual(1)
  })

  it('stop', () => {
    const world = new World()
    TestSystem.stop = jest.fn()
    TestBackgroundSystem.stop = jest.fn()
    world.addSystem(TestSystem)
    world.addBackgroundSystem(TestBackgroundSystem)

    world.start()
    world.stop()

    expect(world._runStatus).toBeFalsy()
    expect(TestSystem.stop).toHaveBeenCalled()
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
  })
})
