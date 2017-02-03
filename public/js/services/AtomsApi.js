import { pandaReqwest } from './pandaReqwest';
import { getStore } from '../util/storeAccessor';

export default {

  fetchAtom: (atomId, atomType) => {
    return pandaReqwest({
      url: `/api/preview/${atomType}/${atomId}`,
      method: 'get'
    });
  },


  createAtom: (atomType) => {
    return pandaReqwest({
      url: `/api/preview/${atomType}`,
      method: 'post'
    })
  }

}
