import Tuple from './tuple'

const OUTPUT_INTERVAL = 5000
const WARNING = 'color: red;'
const NORMAL = 'color: black;'

export default class World {
  constructor() {
    this._tuples = {
      '': new Tuple([])
    }

    this._systems = []

    this._backgroundSystems = []

    this._runStatus = false

    this._components = {}

    this._benchMark = false
    this._totalTime = {
      total: 0
    }
    this._maxTime = {
      total: 0
    }
    this._beginTime = {
    }
    this._benchMarkIndex = 0
    this._maxSystemNameLength = 0
  }

  openBenchMark() {
    this._benchMark = true
  }

  start() {
    if (!this._runStatus) {
      this._backgroundSystems.forEach(system => {
        system.start()
      })
    }
    this._runStatus = true

    if (this._benchMark) {
      this._benchMarkInterval = setInterval(() => {
        console.log('---------------')
        console.log('benchmark ' + this._benchMarkIndex++ + ' time:')
        for (const name in this._totalTime) {
          const average = (this._totalTime[name] * 1000 / (this._benchMarkIndex * OUTPUT_INTERVAL * 16)).toFixed(2)
          console.log(`${name.padEnd(this._maxSystemNameLength, ' ')} %c [maxTime: ${String(this._maxTime[name]).padStart(3, ' ')}ms] %c [average: ${String(average).padStart(5, ' ')}ms] [totalTime: ${this._totalTime[name]}ms]`, this._maxTime[name] > 10 ? WARNING : NORMAL, average > 3 ? WARNING : NORMAL)
        }
      }, OUTPUT_INTERVAL)
    }
  }

  beginBenchMark(name) {
    if (!this._benchMark) {
      return
    }
    this._beginTime[name] = Date.now()
  }

  endBenchMark(name) {
    if (!this._benchMark || this._beginTime[name] === undefined) {
      return
    }
    if (this._maxTime[name] === undefined) {
      this._maxTime[name] = 0
    }
    if (this._totalTime[name] === undefined) {
      this._totalTime[name] = 0
    }

    const cost = Date.now() - this._beginTime[name]
    this._maxTime[name] = Math.max(this._maxTime[name], cost)
    this._totalTime[name] += cost
  }

  update() {
    if (this._benchMark) {
      this._updateStartTime = Date.now()
    }
    this._systems.forEach(system => {
      if (!this._runStatus) {
        return
      }
      if (this._benchMark) {
        this.beginBenchMark(system.name)
        system.update && system.update.apply(system, arguments)
        this.endBenchMark(system.name)
      } else {
        // usually arguments is dt(delta time of this update and last update) and now(the current time)
        system.update && system.update.apply(system, arguments)
      }
    })
    if (this._benchMark) {
      const cost = Date.now() - this._updateStartTime
      this._maxTime.total = Math.max(this._maxTime.total, cost)
      this._totalTime.total += cost
    }
  }

  predictUpdate() {
    this._systems.forEach(system => {
      if (!this._runStatus) {
        return
      }
      system.predictUpdate && system.predictUpdate.apply(system, arguments)
    })
  }

  stop() {
    this._runStatus = false
    this._backgroundSystems.forEach(system => {
      system.stop()
    })
  }

  destroy() {
    if (this._benchMarkInterval) {
      clearInterval(this._benchMarkInterval)
      for (const i in this._totalTime) {
        this._totalTime[i] = 0
      }
      for (const i in this._maxTime) {
        this._maxTime[i] = 0
      }
      this._benchMarkIndex = 0
    }
    this._tuples = {
      '': new Tuple([])
    }
    this._systems.forEach(system => system.destroy())
    this._backgroundSystems.forEach(system => system.destroy())
    this._systems = []
    this._backgroundSystems = []
    this._runStatus = false
    this._components = {}
  }

  // components
  addComponent(key, value) {
    this._components[key] = value !== undefined ? value : true
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
    if (this._benchMark) {
      this._maxSystemNameLength = Math.max(this._maxSystemNameLength, system.name.length)
      this._totalTime[system.name] = 0
      this._maxTime[system.name] = 0
    }
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
    for (const name in this._tuples) {
      this._tuples[name].addEntityIfMatch(entity)
    }
    entity.addToWorld(this)
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

  getEntitiesList(...args) {
    const entities = this.getEntities(...args)
    const list = []
    for (const name in entities) {
      list.push(entities[name])
    }
    return list
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
