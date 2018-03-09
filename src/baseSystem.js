import {
  lowerCamelCase,
  getName,
} from './utils'
import deepCopy from 'deepcopy'

export default class BaseSystem {
  static _restrictRemove = []
  static _restrictAdd = []
  static _restrictGet = []
  static _useStrict = false

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
      throw 'System did\'t add to world'
    }
    if (this._restrictRemove.indexOf(name) === -1) {
      throw `Restrict to remove ${name}`
    }
    this._world.removeComponent(name)
  }

  static getComponent(name) {
    if (this._world === undefined) {
      throw 'System did\'t add to world'
    }
    if (this._restrictGet.indexOf(name) === -1) {
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
      throw 'System did\'t add to world'
    }
    const isComponent = typeof component !== 'string'
    const name = lowerCamelCase(isComponent ? getName(component) : component)

    if (this._restrictAdd.indexOf(name) === -1) {
      throw `Restrict to add ${name}`
    }
    this._world.addComponent(component, value)
  }

  static getEntities() {
    if (this._world === undefined) {
      throw 'System did\'t add to world'
    }

    return this._world.getEntities(...arguments)
  }
}
