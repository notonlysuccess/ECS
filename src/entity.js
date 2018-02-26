import {
  capitalize,
  getName
} from './utils'

let entityId = 0

export default class Entity {
  constructor() {
    this._id = entityId++

    this._world = undefined

    this._entityAddToWorldCb = []

    this._entityRemoveFromWorldCb = []
  }

  addToWorld(world) {
    this._world = world
    this._entityAddToWorldCb.forEach(cb => {
      cb()
    })
  }

  removeFromWorld() {
    this._entityRemoveFromWorldCb.forEach(cb => {
      cb()
    })
    this._world = undefined
  }

  get world() {
    return this._world
  }

  insertAddToWorldCb(cb) {
    this._entityAddToWorldCb.push(cb)
    return this
  }

  insertRemoveFromWorldCb(cb) {
    this._entityRemoveFromWorldCb.push(cb)
    return this
  }

  deleteRemoveFromWorldCb(cb) {
    for (let i = this._entityRemoveFromWorldCb.length - 1; i >= 0; i--) {
      if (cb === this._entityRemoveFromWorldCb[i]) {
        this._entityRemoveFromWorldCb.splice(i, 1)
        return this
      }
    }
    return this
  }

  deleteAddToWorldCb(cb) {
    for (let i = this._entityAddToWorldCb.length - 1; i >= 0; i--) {
      if (cb === this._entityAddToWorldCb[i]) {
        this._entityAddToWorldCb.splice(i, 1)
        return this
      }
    }
    return this
  }

  _addComponentLifeCycle(component) {
    if (component.addToEntityCb) {
      component.addToEntityCb(this)
    }
    if (component.entityAddToWorldCb) {
      this.insertAddToWorldCb(component.entityAddToWorldCb.bind(component))
    }
    if (component.entityRemoveFromWorldCb) {
      this.insertRemoveFromWorldCb(component.entityRemoveFromWorldCb.bind(component))
    }
    return this
  }

  _removeComponentLifeCycle(component) {
    if (component.entityAddToWorldCb) {
      this.deleteAddToWorldCb(component.entityAddToWorldCb.bind(component))
    }
    if (component.entityRemoveFromWorldCb) {
      this.deleteRemoveFromWorldCb(component.entityRemoveFromWorldCb.bind(component))
    }
    if (component.removeFromEntityCb) {
      component.removeFromEntityCb(this)
    }
    return this
  }

  has() {
    for (const i in arguments) {
      if (!this.hasOwnProperty(capitalize(arguments[i]))) {
        return false
      }
    }
    return true
  }

  /**
   * component
   * tag
   * key, value
   */
  addComponent(component, value) {
    const isComponent = typeof component !== 'string'
    const name = capitalize(isComponent ? getName(component) : component)
    const hasComponent = this.hasOwnProperty(name)

    if (hasComponent && isComponent) {
      this._removeComponentLifeCycle(this[name])
    }
    this[name] = isComponent ? component : (value !== undefined ? value : true)
    this._addComponentLifeCycle(this[name])

    if (!hasComponent && this._world) {
      this._world.addEntityToTuples(this)
    }
    return this
  }

  removeComponent(name) {
    name = capitalize(name)
    if (this.hasOwnProperty(name)) {
      this._removeComponentLifeCycle(this[name])
      delete this[name]
      if (this._world) {
        this._world.removeEntityFromTuples(this)
      }
    }
    return this
  }

  get id() {
    return this._id
  }
}
