import System from '../src/system'

class TestSystem extends System {
}

describe('System test', () => {
  it('update', () => {
    expect(TestSystem.update).toThrowError('System.update must be overwrited')
  })
})
