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

    searchAtoms: function(query) {
        console.log(`/support/previewCapi/atoms?${uriEncodeParams(query)}`);
        return pandaFetch(
            `/support/previewCapi/atoms?${uriEncodeParams(query)}`,
            {
                method: 'get',
                credentials: 'same-origin'
            }
        )
        .then((res) => res.json())
        .then((json) => {
            console.log(json)
            return Promise.resolve(json.response.results)});
    }

}



