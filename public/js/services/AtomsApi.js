import { pandaFetch } from './pandaFetch';

export default {

  getAtom: (atomType, atomId) => {
    return pandaFetch(
      new Request(
        `/api/preview/${atomType}/${atomId}`,
        {
          method: 'get',
          credentials: 'same-origin'
        }
      )
    );
  },


  createAtom: (atomType, atomInfo) => {
    return pandaFetch(
      new Request(
        `/api/preview/${atomType}`,
        {
          method: 'post',
          credentials: 'same-origin',
          body: JSON.stringify(atomInfo),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    );
  },

  updateAtom: (atom) => {
    return pandaFetch(
      new Request(
        `/api/preview/${atom.atomType}/${atom.id}`,
        {
          method: 'put',
          credentials: 'same-origin',
          body: JSON.stringify(atom),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    );
  }
};
