import World from '../src/world'
import BackgroundSystem from '../src/backgroundSystem'

class TestBackgroundSystem extends BackgroundSystem {
}

describe('BackgroundSystem test', () => {
  it('start', () => {
    expect(TestBackgroundSystem.start).toThrowError('BackgroundSystem.start must be overwrited')
  })

  it('stop', () => {
    expect(TestBackgroundSystem.stop).toThrowError('BackgroundSystem.stop must be overwrited')
  })
})
