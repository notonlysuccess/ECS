import Entity from '../src/entity'
import World from '../src/world'

class Component1 {
  static sValue = 'test1'

  constructor(value) {
    this.value = value
  }
}

class Component2 {
  constructor(value) {
    this.value = value
  }
}

const WORLD_SYMBOL = 'worldSymbol'
describe('Entity Test', () => {
  let world

  beforeEach(() => {
    world = new World()
    world.symbol = WORLD_SYMBOL
  })

  it('Entity id', () => {
    const entities = []

    for (let i = 0; i < 10; i ++) {
      entities.push(new Entity())
    }
    for (let i = 0; i < 10; i ++) {
      expect(entities[i]._id).toEqual(i)
    }
  })

  it('AddToWorld', () => {
    const entity = new Entity()
    let _entityAddToWorldCbCalled = false
    entity._entityAddToWorldCb.push(() => {
      _entityAddToWorldCbCalled = true
    })
    entity.addToWorld(world)
    expect(entity._world.symbol).toEqual(WORLD_SYMBOL)
    expect(_entityAddToWorldCbCalled).toBeTruthy()
  })

  it('removeFromWorld', () => {
    const entity = new Entity()
    let _entityRemoveFromWorldCbCalled = false
    entity._entityRemoveFromWorldCb.push(() => {
      _entityRemoveFromWorldCbCalled = true
    })
    entity.addToWorld(world)
    entity.removeFromWorld()
    expect(entity._world).toBeUndefined()
    expect(_entityRemoveFromWorldCbCalled).toBeTruthy()
  })

  it('getWorld', () => {
    const entity = new Entity()
    entity.addToWorld(world)
    expect(entity.world.symbol).toEqual(WORLD_SYMBOL)
  })

  it('insertAddToWorldCb', () => {
    let count = 0
    const entity = new Entity()
    const cb1 = () => count += 1
    const cb2 = () => count += 10
    const returnEntity = entity.insertAddToWorldCb(cb1)
    entity.insertAddToWorldCb(cb2)
    entity.addToWorld(world)
    expect(count).toEqual(11)

    expect(returnEntity.id).toEqual(entity.id)
  })

  it('insertRemoveFromWorldCb', () => {
    const entity = new Entity()
    const cb1 = () => console.log(1)
    const cb2 = () => console.log(2)
    const returnEntity = entity.insertAddToWorldCb(cb1)
    expect(entity._entityAddToWorldCb.length).toEqual(1)
    entity.insertAddToWorldCb(cb2)
    expect(entity._entityAddToWorldCb.length).toEqual(2)

    expect(returnEntity.id).toEqual(entity.id)
  })

  it('deleteAddToWorldCb', () => {
    const entity = new Entity()
    const cb1 = () => console.log(1)
    const cb2 = () => console.log(2)
    entity.insertAddToWorldCb(cb1)
    entity.insertAddToWorldCb(cb2)
    expect(entity._entityAddToWorldCb.length).toEqual(2)
    const returnEntity = entity.deleteAddToWorldCb(cb1)
    expect(entity._entityAddToWorldCb.length).toEqual(1)
    expect(entity._entityAddToWorldCb[0]).toEqual(cb2)

    expect(returnEntity.id).toEqual(entity.id)
  })

  it('deleteRemoveFromWorldCb', () => {
    const entity = new Entity()
    const cb1 = () => console.log(1)
    const cb2 = () => console.log(2)
    entity.insertRemoveFromWorldCb(cb1)
    entity.insertRemoveFromWorldCb(cb2)
    expect(entity._entityRemoveFromWorldCb.length).toEqual(2)
    const returnEntity = entity.deleteRemoveFromWorldCb(cb1)
    expect(entity._entityRemoveFromWorldCb.length).toEqual(1)
    expect(entity._entityRemoveFromWorldCb[0]).toEqual(cb2)

    expect(returnEntity.id).toEqual(entity.id)
  })

  it('addComponent with Component', () => {
    const entity = new Entity()
    entity.addComponent(Component1)
    entity.addComponent(new Component2('test2'))
    expect(entity.component1.sValue).toEqual('test1')
    expect(entity.component2.value).toEqual('test2')
  })

  it('addComponent with tag', () => {
    const entity = new Entity()
    entity.addComponent('OneTag')
    entity.addComponent('Tag2')
    entity.addComponent('tag3')
    expect(entity.oneTag).toBeTruthy()
    expect(entity.tag2).toBeTruthy()
    expect(entity.tag3).toBeTruthy()
    expect(entity.otherTag).toBeUndefined()
  })

  it('addComponent with keyValue', () => {
    const entity = new Entity()
    entity.addComponent('name', 'test')
    entity.addComponent('speed', 123)
    expect(entity.name).toEqual('test')
    expect(entity.speed).toEqual(123)
  })

  it('addComponent: inner function', () => {
    const entity = new Entity()
    const testValue = 'testAddComponnetInnerFunction'
    const component1 = new Component1(testValue)
    const component2 = new Component2(testValue)
    // mock Entity._addComponentLifeCycle
    let entity_addComponentLifeCycleCount = 0
    entity._addComponentLifeCycle = c => {
      expect(c.value).toEqual(testValue)
      ++entity_addComponentLifeCycleCount
    }
    // mock Entity._removeComponentLifeCycle
    let entity_removeComponentLifeCycleCount = 0
    entity._removeComponentLifeCycle = c => {
      expect(c.value).toEqual(testValue)
      ++entity_removeComponentLifeCycleCount
    }
    // mock World.removeEntityFromTuples
    let world_addEntityToTuplesCount = 0
    world.addEntityToTuples = e => {
      expect(e.id).toEqual(entity.id)
      ++world_addEntityToTuplesCount
    }
    // add first component(tag)
    entity.addComponent('tag')
    expect(entity_addComponentLifeCycleCount).toEqual(0)
    expect(entity_removeComponentLifeCycleCount).toEqual(0)
    expect(world_addEntityToTuplesCount).toEqual(0)
    // add second component(component)
    entity.addComponent(component1)
    expect(entity_addComponentLifeCycleCount).toEqual(1)
    expect(entity_removeComponentLifeCycleCount).toEqual(0)
    expect(world_addEntityToTuplesCount).toEqual(0)
    // add same component(component)
    entity.addComponent(component1)
    expect(entity_addComponentLifeCycleCount).toEqual(2)
    expect(entity_removeComponentLifeCycleCount).toEqual(1)
    expect(world_addEntityToTuplesCount).toEqual(0)
    // add entity to world
    entity.addToWorld(world)
    // add third component(component)
    entity.addComponent(component2)
    expect(entity_addComponentLifeCycleCount).toEqual(3)
    expect(entity_removeComponentLifeCycleCount).toEqual(1)
    expect(world_addEntityToTuplesCount).toEqual(1)
    // add some component(component)
    entity.addComponent(component2)
    expect(entity_addComponentLifeCycleCount).toEqual(4)
    expect(entity_removeComponentLifeCycleCount).toEqual(2)
    expect(world_addEntityToTuplesCount).toEqual(1)
  })

  it('removeComponent', () => {
    const entity = new Entity()
    // add four components
    entity.addComponent(Component1)
    entity.addComponent(new Component2('test2'))
    entity.addComponent('tag')
    entity.addComponent('key', 'value')
    // remove four components
    entity.removeComponent('component1')
    entity.removeComponent('component2')
    entity.removeComponent('tag')
    entity.removeComponent('key')
    // check componnets
    expect(entity.component1).toBeUndefined()
    expect(entity.component2).toBeUndefined()
    expect(entity.tag).toBeUndefined()
    expect(entity.key).toBeUndefined()
  })

  it('removeComponent: inner function', () => {
    const entity = new Entity()
    // mock Entity._removeComponentLifeCycle
    let entity_removeComponentLifeCycleCount = 0
    entity._removeComponentLifeCycle = () => {
      ++entity_removeComponentLifeCycleCount
    }
    // mock World.removeEntityFromTuples
    let world_removeEntityFromTuplesCount = 0
    world.removeEntityFromTuples = e => {
      expect(e.id).toEqual(entity.id)
      ++world_removeEntityFromTuplesCount
    }
    // add components
    entity.addComponent(Component1)
    entity.addComponent(new Component2('test2'))
    entity.addComponent('tag')
    // remove first component
    entity.removeComponent('component1')
    expect(entity_removeComponentLifeCycleCount).toEqual(1)
    expect(world_removeEntityFromTuplesCount).toEqual(0)
    // remove second component
    entity.removeComponent('component2')
    expect(entity_removeComponentLifeCycleCount).toEqual(2)
    expect(world_removeEntityFromTuplesCount).toEqual(0)
    // remove some component
    entity.removeComponent('component2')
    expect(entity_removeComponentLifeCycleCount).toEqual(2)
    expect(world_removeEntityFromTuplesCount).toEqual(0)
    // add to world then remove the remain two components
    entity.addToWorld(world)
    // remove third component
    entity.removeComponent('tag')
    expect(entity_removeComponentLifeCycleCount).toEqual(3)
    expect(world_removeEntityFromTuplesCount).toEqual(1)
  })

  it('has', () => {
    const entity = new Entity()
    entity.addComponent('OneTag')
    entity.addComponent('Tag2')
    entity.addComponent('tag3')
    expect(entity.has('oneTag', 'tag2')).toBeTruthy()
    expect(entity.has('oneTag', 'tag2', 'Tag3')).toBeTruthy()
    expect(entity.has('otherTag')).toBeFalsy()
  })

  it('_addComponentLifeCycle', () => {
    const entity = new Entity()
    const component = new Component1('value')
    component.addToEntityCb = function(e) {
      expect(e.id).toEqual(entity.id)
      this.value += '1'
    }
    component.entityAddToWorldCb = function() {
      this.value += '2'
    }
    component.entityRemoveFromWorldCb = function() {
      this.value += '3'
    }
    component.entityRemoveFromWorldCb = component.entityRemoveFromWorldCb.bind(component)
    component.entityAddToWorldCb = component.entityAddToWorldCb.bind(component)

    entity._addComponentLifeCycle(component)
    expect(component.value).toEqual('value1')
    expect(entity._entityAddToWorldCb.length).toEqual(1)
    expect(entity._entityRemoveFromWorldCb.length).toEqual(1)
    entity._entityAddToWorldCb[0]()
    expect(component.value).toEqual('value12')
    entity._entityRemoveFromWorldCb[0]()
    expect(component.value).toEqual('value123')
  })

  it('_removeComponentLifeCycle', () => {
    const entity = new Entity()
    const component = new Component1('value')
    component.removeFromEntityCb = function(e) {
      expect(e.id).toEqual(entity.id)
      this.value += '1'
    }
    component.entityAddToWorldCb = function() {}
    component.entityRemoveFromWorldCb = function() {}

    entity._addComponentLifeCycle(component)
    expect(entity._entityAddToWorldCb.length).toEqual(1)
    expect(entity._entityRemoveFromWorldCb.length).toEqual(1)

    entity._removeComponentLifeCycle(component)
    expect(component.value).toEqual('value1')
    expect(entity._entityAddToWorldCb.length).toEqual(0)
    expect(entity._entityRemoveFromWorldCb.length).toEqual(0)
  })
})
