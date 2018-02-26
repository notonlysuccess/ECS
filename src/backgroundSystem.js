export default class BackgroundSystem {
  static addWorld(world) {
    this._world = world
  }

  static init() {}

  static start() {
    console.error('backgroundSystem.start must be overwrited')
  }

  static stop() {
    console.error('backgroundSystem.stop must be overwrited')
  }

  static _getEntities() {
    return this._world.getEntities.apply(this._world, arguments)
  }
}
