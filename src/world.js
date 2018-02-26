import Tuple from './tuple'
import {
  capitalize,
  getName
} from './utils'

const timer = false
let id = 0

export default class World {
  constructor() {
    this._tuples = {
      '': new Tuple([])
    }

    this._systems = []

    this._backgroundSystems = []

    this._runStatus = false

    if (timer) {
      this.times = {}
    }
  }

  start() {
    if (!this._runStatus) {
      // console.log('start')
      console.log(this._backgroundSystems)
      this._backgroundSystems.forEach(system => {
        console.log('system start')
        system.start()
      })
    }
    this._runStatus = true

    if (timer) {
      setInterval(() => {
        console.log('-------------------')
        console.log(id++)
        let total = 0

        for (const name in this.times) {
          console.log(name, this.times[name])
          total += this.times[name]
        }
        console.log('total', total)
      }, 5000)
    }
  }

  update() {
    this._systems.forEach(system => {
      if (!this._runStatus) {
        return
      }
      if (timer) {
        if (!this.times.hasOwnProperty(system.name)) {
          this.times[system.name] = 0
        }
        const s = Date.now()

        system.update.apply(system, arguments)
        this.times[system.name] += (Date.now() - s)
      } else {
        system.update.apply(system, arguments)
      }
    })
  }

  gameStop() {
    this._systems = []
  }

  pause() {
    this._runStatus = false
    this._backgroundSystems.forEach(system => {
      if (typeof system.pause === 'function') {
        system.pause()
      } else {
        system.stop()
      }
    })
  }

  stop() {
    this._runStatus = false
    this._backgroundSystems.forEach(system => {
      system.stop()
    })

    this._systems.forEach(system => {
      system.stop()
    })
  }

  clear() {
    this._tuples = {
      '': new Tuple([])
    }
    this._systems.forEach(system => system.destroy())
    this._systems = []
    this._backgroundSystems = []
  }

  // components
  addComponent(component, value) {
    const isComponent = typeof component !== 'string'
    const name = capitalize(isComponent ? getName(component) : component)

    this[name] = isComponent ? component : (value !== undefined ? value : true)
    return this
  }

  removeComponent(name) {
    delete this[capitalize(name)]
    return this
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
        return this
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
        return this
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

  // set cmd(c) {
  //   console.log('cmd', c)
  //   this._cmd = c
  // }

  // get cmd() {
  //   return this._cmd
  // }

}
