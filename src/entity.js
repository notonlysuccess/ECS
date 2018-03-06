import {
  lowerCamelCase,
  getName
} from './utils'

let entityId = 0

export default class Entity {
  constructor() {
    this._id = entityId++

    this._world = undefined

    // these callbacks will be called when entity add to world
    this._entityAddToWorldCb = []

    // these callbacks will be called when entity remove from world
    this._entityRemoveFromWorldCb = []
  }

  get id() {
    return this._id
  }

  get world() {
    return this._world
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
        break
      }
    }
    return this
  }

  deleteAddToWorldCb(cb) {
    for (let i = this._entityAddToWorldCb.length - 1; i >= 0; i--) {
      if (cb === this._entityAddToWorldCb[i]) {
        this._entityAddToWorldCb.splice(i, 1)
        break
      }
    }
    return this
  }

  has() {
    for (const i in arguments) {
      if (!this.hasOwnProperty(lowerCamelCase(arguments[i]))) {
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
    const name = lowerCamelCase(isComponent ? getName(component) : component)
    const hasComponent = this.hasOwnProperty(name)

    if (hasComponent && isComponent) {
      this._removeComponentLifeCycle(this[name])
    }
    this[name] = isComponent ? component : (value !== undefined ? value : true)
    if (isComponent) {
      this._addComponentLifeCycle(this[name])
    }

    if (!hasComponent && this._world) {
      this._world.addEntityToTuples(this)
    }
    return this
  }

  removeComponent(name) {
    name = lowerCamelCase(name)
    if (this.hasOwnProperty(name)) {
      this._removeComponentLifeCycle(this[name])
      delete this[name]
      if (this._world) {
        this._world.removeEntityFromTuples(this)
      }
    }
    return this
  }

  _addComponentLifeCycle(component) {
    if (component.addToEntityCb) {
      // it will be called when component added to entity
      component.addToEntityCb(this)
    }
    if (component.entityAddToWorldCb) {
      // it will be called when entity add to world
      this.insertAddToWorldCb(component.entityAddToWorldCb)
    }
    if (component.entityRemoveFromWorldCb) {
      // it will be called when entity remove from world
      this.insertRemoveFromWorldCb(component.entityRemoveFromWorldCb)
    }
    return this
  }

  _removeComponentLifeCycle(component) {
    if (component.entityAddToWorldCb) {
      this.deleteAddToWorldCb(component.entityAddToWorldCb)
    }
    if (component.entityRemoveFromWorldCb) {
      this.deleteRemoveFromWorldCb(component.entityRemoveFromWorldCb)
    }
    if (component.removeFromEntityCb) {
      // it will be called when component remove from entity
      component.removeFromEntityCb(this)
    }
    return this
  }
}
