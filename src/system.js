import BaseSystem from './baseSystem'

export default class System extends BaseSystem {
  static update() {
    throw 'System.update must be overwrited'
  }
}
