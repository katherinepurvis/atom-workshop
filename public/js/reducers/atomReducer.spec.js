import atom from './atomReducer';

describe('atom reducer', () => {

  it('should return the inital null state', () => {
    expect(
      atom(undefined, {})
    ).toEqual(null, {});
  });

  it('should handle ATOM_GET_RECEIVE', () => {
    expect(
      atom({}, {
        type: 'ATOM_GET_RECEIVE',
        atom: 'this is an atom'
      })
    ).toEqual('this is an atom');
  });

  it('should handle ATOM_CREATE_RECEIVE', () => {
    expect(
      atom({}, {
        type: 'ATOM_CREATE_RECEIVE',
        atom: 'this is an atom'
      })
    ).toEqual('this is an atom');
  });
});
