export default class System {
  static addWorld(world) {
    this._world = world
  }

  static init() {}

  static update() {
    throw 'System.update must be overwrited'
  }

  static destroy() {}

  static stop() {}
}
