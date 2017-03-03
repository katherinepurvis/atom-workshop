import { pandaFetch } from './pandaFetch';
import { uriEncodeParams } from '../util/uriEncodeParams';

export default {

    searchTags: function(searchText) {
        return pandaFetch(
            `/support/previewCapi/tags?q=${searchText}`,
            {
                method: 'get',
                credentials: 'same-origin'
            }
        )
        .then((res) => res.json())
        .then((json) => Promise.resolve(json.response.results));
    },

    sanitiseQuery: function(query) {
      return Object.keys(query)
          .filter(k => (query[k] && query[k].length != 0))
          .reduce( (res, key) => (res[key] = query[key], res), {} );
    },

    searchAtoms: function(query) {
        return pandaFetch(
            `/support/previewCapi/atoms?${uriEncodeParams(this.sanitiseQuery(query))}`,
            {
                method: 'get',
                credentials: 'same-origin'
            }
        )
        .then((res) => res.json())
        .then((json) => Promise.resolve(json.response.results));
    }

};
