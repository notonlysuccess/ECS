export default class BaseSystem {
  static _restrictRemove = []
  static _restrictAdd = []
  static _restrictGet = []
  static _useStrict = false
  static _restrict = false

  static addWorld(world) {
    this._world = world
  }

  static clear() {
    this._world = undefined
    this._restrictRemove = []
    this._restrictAdd = []
    this._restrictGet = []
  }

  static init() {}

  static destroy() {}

  static _checkWorld() {
    if (this._world === undefined) {
      console.error('System did\'t add to world')
      throw 'System did\'t add to world'
    }
  }

  static removeComponent(name) {
    this._checkWorld()
    this._world.removeComponent(name)
  }

  static getComponent(name) {
    this._checkWorld()
    return this._world.getComponent(name)
  }

  static addComponent(key, value) {
    this._checkWorld()
    this._world.addComponent(key, value)
  }

  static getEntities() {
    this._checkWorld()
    return this._world.getEntities(...arguments)
  }

  static getEntitiesList() {
    this._checkWorld()
    return this._world.getEntitiesList(...arguments)
  }

  static getEntity(entityId) {
    this._checkWorld()
    return this._world.getEntity(entityId)
  }

  static addEntity(entity) {
    this._checkWorld()
    this._world.addEntity(entity)
  }

  static removeEntity(entity) {
    this._checkWorld()
    this._world.removeEntity(entity)
  }
}
