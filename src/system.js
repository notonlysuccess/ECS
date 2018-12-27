import BaseSystem from './baseSystem'

export default class System extends BaseSystem {
  static update() {
    throw new Error('System.update must be overwrited')
  }
}
