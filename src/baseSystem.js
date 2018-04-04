import {
  lowerCamelCase,
  getName,
  deepCopy
} from './utils'

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

  static removeComponent(name) {
    if (this._world === undefined) {
      console.error('System did\'t add to world')
      throw 'System did\'t add to world'
    }
    if (this._restrict && this._restrictRemove.indexOf(name) === -1) {
      console.log(`Restrict to remove ${name}`)
      throw `Restrict to remove ${name}`
    }
    this._world.removeComponent(name)
  }

  static getComponent(name) {
    if (this._world === undefined) {
      console.error('System did\'t add to world')
      throw 'System did\'t add to world'
    }
    if (this._restrict && this._restrictGet.indexOf(name) === -1) {
      console.log(`Restrict to get ${name}`)
      throw `Restrict to get ${name}`
    }
    // before release, remove deepCopy function to improve performance
    if (this._useStrict) {
      return deepCopy(this._world.getComponent(name))
    }
    return this._world.getComponent(name)
  }

  static addComponent(component, value) {
    if (this._world === undefined) {
      console.error('System did\'t add to world')
      throw 'System did\'t add to world'
    }
    const isComponent = typeof component !== 'string'
    const name = lowerCamelCase(isComponent ? getName(component) : component)

    if (this._restrict && this._restrictAdd.indexOf(name) === -1) {
      console.log(`Restrict to add ${name}`)
      throw `Restrict to add ${name}`
    }
    this._world.addComponent(component, value)
  }

  static getEntities() {
    if (this._world === undefined) {
      console.error('System did\'t add to world')
      throw 'System did\'t add to world'
    }

    return this._world.getEntities(...arguments)
  }

  static getEntity() {
    if (this._world === undefined) {
      console.error('System did\'t add to world')
      throw 'System did\'t add to world'
    }

    const entities = this._world.getEntities(...arguments)
    for (const key in entities) {
      return entities[key]
    }
    return undefined
  }

  static addEntity(entity) {
    if (this._world === undefined) {
      console.error('System did\'t add to world')
      throw 'System did\'t add to world'
    }

    this._world.addEntity(entity)
  }

  static removeEntity(entity) {
    if (this._world === undefined) {
      console.error('System did\'t add to world')
      throw 'System did\'t add to world'
    }

    this._world.removeEntity(entity)
  }
}
