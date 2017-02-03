import { pandaFetch } from './pandaFetch';
import { getStore } from '../util/storeAccessor';

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
    )
  }

}
