import BaseSystem from './baseSystem'

export default class BackgroundSystem extends BaseSystem {
  static start() {
    throw new Error('BackgroundSystem.start must be overwrited')
  }

  static stop() {
    throw new Error('BackgroundSystem.stop must be overwrited')
  }
}
