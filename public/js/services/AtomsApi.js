import { pandaFetch } from './pandaFetch';

export default {

  fetchAtom: (atomId, atomType) => {
    return pandaFetch(
      new Request(
        `/api/preview/${atomType}/${atomId}`,
        {
          method: 'get'
        }
      )
    );
  },


  createAtom: (atomType) => {
    return pandaFetch(
      new Request(
        `/api/preview/${atomType}`,
        {
          method: 'post'
        }
      )
    );
  }
};
