import { pandaReqwest } from './pandaReqwest';
import { getStore } from '../util/storeAccessor';

export default {

  fetchAtom: (atomId) => {
    return pandaReqwest({
      url: '/api/preview/' + atomId,
      method: 'get'
    });
  }
  
}
