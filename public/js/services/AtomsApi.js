import { pandaFetch } from './pandaFetch';

export default {

  fetchAtom: (atomId, atomType) => {
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


  createAtom: (atomType) => {
    return pandaFetch(
      new Request(
        `/api/preview/${atomType}`,
        {
          method: 'post',
          credentials: 'same-origin'
        }
      )
    );
  }
};
