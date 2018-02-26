export default class System {
  static addWorld(world) {
    this._world = world
  }

  static init() {}

  static update() {
    console.error('system.update must overwrite')
  }

  static destroy() {}

  static stop() {}

  static _getEntities() {
    return this._world.getEntities.apply(this._world, arguments)
  }
}
