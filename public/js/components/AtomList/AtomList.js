import React, { PropTypes } from 'react';

import AtomListItem from '../AtomListItem/AtomListItem';


class AtomList extends React.Component {

    static propTypes = {
        config: PropTypes.shape({
            atomEditorUrls: PropTypes.shape({
                explainer: PropTypes.string,
                media: PropTypes.string
            }),
            isEmbedded: PropTypes.bool.isRequired
        }),
        atomListActions: PropTypes.shape({
            getAtomList: PropTypes.func.isRequired
        }).isRequired,
        atomList: PropTypes.array,
        search: PropTypes.object
    };

    componentWillMount() {
        this.props.atomListActions.getAtomList();
    }

    componentWillReceiveProps(newProps) {
      const oldSearch = this.props.search;
      const newSearch = newProps.search;

      if (oldSearch !== newSearch && newSearch !== {}) {
        this.props.atomListActions.getAtomList(newSearch);
    } else if (newSearch === {} && oldSearch !== {}) {
        this.props.atomListActions.getAtomList();
      }
    }

    render () {

        if (!this.props.atomList) {
            return <div>Loading...</div>;
        }

        return (
            <div className="page__section">
                <div className="atom-list">
                    {this.props.atomList.map((atom) => <AtomListItem atom={atom} config={this.props.config} key={atom.id}/>)}
                </div>
            </div>
        );
    }
}


//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as getAtomListActions from '../../actions/AtomListActions/getAtomList';

function mapStateToProps(state) {
    return {
        atomList: state.atomList,
        config: state.config,
        search: state.search
    };
}

function mapDispatchToProps(dispatch) {
    return {
        atomListActions: bindActionCreators(Object.assign({}, getAtomListActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AtomList);
