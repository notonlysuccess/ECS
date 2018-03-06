export default class Tuple {
  constructor(componentNames) {
    this._componentNames = componentNames

    this._entities = {}
  }

  addEntityIfMatch(entity) {
    if (!this._entities.hasOwnProperty(entity.id) && this.matchEntity(entity)) {
      this._entities[entity.id] = entity
    }
    return this
  }

  removeEntity(entity) {
    if (this._entities.hasOwnProperty(entity.id)) {
      delete this._entities[entity.id]
    }
    return this
  }

  removeEntityIfNotMatch(entity) {
    if (this._entities.hasOwnProperty(entity.id) && !this.matchEntity(entity)) {
      delete this._entities[entity.id]
    }
    return this
  }

  matchEntity(entity) {
    return entity.has(...this._componentNames)
  }

  get entities() {
    return this._entities
  }
}
