import config from './configReducer';

describe('config reducer', () => {

  it('should return the initial state', () => {
    expect(
      config(undefined, {})
    ).toEqual({}, {})
  })

  it('should handle CONFIG_RECEIVED', () => {
    expect(
      config({}, {
        type: 'CONFIG_RECEIVED',
        config: 'this is some configuration'
      })
    ).toEqual('this is some configuration')
  })
})
