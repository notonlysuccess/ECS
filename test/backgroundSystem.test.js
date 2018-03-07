import World from '../src/world'
import BackgroundSystem from '../src/backgroundSystem'

class TestBackgroundSystem extends BackgroundSystem {
}

describe('BackgroundSystem test', () => {
  it('addWorld', () => {
    const world = new World()
    TestBackgroundSystem.addWorld(world)
    expect(TestBackgroundSystem._world).toEqual(world)
  })

  it('start', () => {
    expect(TestBackgroundSystem.start).toThrowError('BackgroundSystem.start must be overwrited')
  })

  it('stop', () => {
    expect(TestBackgroundSystem.stop).toThrowError('BackgroundSystem.stop must be overwrited')
  })

  it('function check', () => {
    TestBackgroundSystem.init()
    TestBackgroundSystem.destroy()
  })
})
