import error from './errorReducer';

describe('error reducer', () => {

  it('should return the initial state', () => {
    expect(
      error(undefined, {})
    ).toEqual(false, {})
  })

  it('should handle CLEAR_ERROR', () => {
    expect(
      error({}, {
        type: 'CLEAR_ERROR'
      })
    ).toEqual(false)
  })

  it('should handle SHOW_ERROR', () => {
    expect(
      error({}, {
        type: 'SHOW_ERROR',
        message: 'OMG SOMETHING WENT WRONG'
      })
    ).toEqual('OMG SOMETHING WENT WRONG')
  })
})
