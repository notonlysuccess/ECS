import Tuple from './tuple'

export default class World {
  constructor() {
    this._tuples = {
      '': new Tuple([])
    }

    this._systems = []

    this._backgroundSystems = []

    this._runStatus = false

    this._components = {}
  }

  start() {
    if (!this._runStatus) {
      this._backgroundSystems.forEach(system => {
        system.start()
      })
    }
    this._runStatus = true
  }

  update() {
    this._systems.forEach(system => {
      if (!this._runStatus) {
        return
      }
      // usually arguments is dt(delta time of this update and last update) and now(the current time)
      system.update.apply(system, arguments)
    })
  }

  stop() {
    this._runStatus = false
    this._backgroundSystems.forEach(system => {
      system.stop()
    })
  }

  destroy() {
    this._tuples = {
      '': new Tuple([])
    }
    this._systems.forEach(system => system.destroy())
    this._backgroundSystems.forEach(system => system.destroy())
    this._systems = []
    this._backgroundSystems = []
    this._runStatus = false
  }

  // components
  addComponent(key, value) {
    this._components[key] = value || true
    return this
  }

  removeComponent(name) {
    delete this._components[name]
  }

  getComponent(name) {
    return this._components[name]
  }

  // system
  addSystem(system) {
    this._systems.push(system)
    system.addWorld(this)
    system.init()
    return this
  }

  removeSystem(system) {
    for (let i = 0; i < this._systems.length; ++i) {
      if (this._systems[i] === system) {
        this._systems.splice(i, 1)
        break
      }
    }
    return this
  }

  // backgroundSystem
  addBackgroundSystem(system) {
    this._backgroundSystems.push(system)
    system.addWorld(this)
    system.init()
    return this
  }

  removeBackgroundSystem(system) {
    for (let i = 0; i < this._backgroundSystems.length; ++i) {
      if (this._backgroundSystems[i] === system) {
        this._backgroundSystems.splice(i, 1)
        break
      }
    }
    return this
  }

  // entity
  addEntity(entity) {
    entity.addToWorld(this)
    for (const name in this._tuples) {
      this._tuples[name].addEntityIfMatch(entity)
    }
    return this
  }

  removeEntity(entity) {
    entity.removeFromWorld()
    for (const name in this._tuples) {
      this._tuples[name].removeEntity(entity)
    }
    return this
  }

  getEntities() {
    const tuple = this._ensureTupleExists(arguments)

    return tuple.entities
  }

  getEntity(entityId) {
    return this._tuples[''].entities[entityId]
  }

  // invoked by entity when component adding to entity
  addEntityToTuples(entity) {
    for (const name in this._tuples) {
      this._tuples[name].addEntityIfMatch(entity)
    }
  }

  // invoked by entity when component removing from entity
  removeEntityFromTuples(entity) {
    for (const name in this._tuples) {
      this._tuples[name].removeEntityIfNotMatch(entity)
    }
  }

  _ensureTupleExists(componentNames) {
    const name = Array.prototype.join.call(componentNames, ',')

    if (!this._tuples.hasOwnProperty(name)) {
      this._tuples[name] = new Tuple(Array.prototype.slice.call(componentNames))
      const allEntities = this._tuples[''].entities

      for (const i in allEntities) {
        this._tuples[name].addEntityIfMatch(allEntities[i])
      }
    }

    return this._tuples[name]
  }
}
