import BaseSystem from './baseSystem'

export default class BackgroundSystem extends BaseSystem {
  static start() {
    throw 'BackgroundSystem.start must be overwrited'
  }

  static stop() {
    throw 'BackgroundSystem.stop must be overwrited'
  }
}
