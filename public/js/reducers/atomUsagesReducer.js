export default function atomUsages(state = null, action) {
    switch (action.type) {
        case 'ATOM_USAGES_GET_RECEIVE':
            return action.atomUsages || null;

        default:
            return state;
    }
}
