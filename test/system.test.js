import World from '../src/world'
import System from '../src/system'

class TestSystem extends System {
}

describe('System test', () => {
  it('addWorld', () => {
    const world = new World()
    TestSystem.addWorld(world)
    expect(TestSystem._world).toEqual(world)
  })

  it('update', () => {
    expect(TestSystem.update).toThrowError('System.update must be overwrited')
  })

  it('function check', () => {
    TestSystem.init()
    TestSystem.destroy()
  })
})
