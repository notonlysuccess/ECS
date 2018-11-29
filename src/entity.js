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

  inWorld() {
    return this._world !== undefined
  }

  destroy() {
    if (this._world) {
      this._world.removeEntity(this)
    }
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
      if (!this.hasOwnProperty(arguments[i])) {
        return false
      }
    }
    return true
  }

  /**
   * tag
   * key, value
   */
  addComponent(key, value) {
    const hasComponent = this.hasOwnProperty(key)
    this[key] && this._removeComponentLifeCycle(this[key])
    this[key] = value !== undefined ? value : true
    this[key] && this._addComponentLifeCycle(this[key])

    if (!hasComponent && this._world) {
      this._world.addEntityToTuples(this)
    }
    return this
  }

  removeComponent(name) {
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
