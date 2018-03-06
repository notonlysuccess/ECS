export default class BackgroundSystem {
  static addWorld(world) {
    this._world = world
  }

  static init() {}

  static start() {
    throw 'BackgroundSystem.start must be overwrited'
  }

  static stop() {
    throw 'BackgroundSystem.stop must be overwrited'
  }
}
