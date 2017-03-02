import React from 'react';

import {allAtomTypes} from '../../constants/atomData';
import {atomTitleExtractor} from '../../util/atomTitleExtractor';
import {Link} from 'react-router';
import _mapValues from 'lodash/fp/mapValues';

class AtomList extends React.Component {
    
    // state = {
    //     params: {
    //         types:"explainer,cta,recipe"
    //     }
    // };
    
    componentWillMount() {
        this.props.atomListActions.getAtomList({types:"explainer,cta,recipe,storyquestions"});
    }
    
    // updateAtomList = (newValue, fieldName) => {
    //     // this.setState({
    //     //     params[fieldName]: newValue
    //     // })
    //     this.props.atomListActions.getAtomList(this.state.params);
    // };

    getUserString = (changeRecord) => {
        if (!changeRecord || !changeRecord.user) return 'unknown';
        if (!changeRecord.user.firstName || !changeRecord.user.lastName) return changeRecord.user.email;
        return `${changeRecord.user.firstName} ${changeRecord.user.lastName}`
    }

    render () {

        if (!this.props.atomList) {
            return <div>Loading...</div>;
        }

        return (
            <div className="page__section">
                <h1 className="page__subheading">Atoms</h1>
                <div className="atom-list">
                    <table className="atom-list__table">
                        <thead>
                            <tr className="atom-list__header-row">
                                <th className="atom-list__header">Title</th>
                                <th className="atom-list__header">Type</th>
                                <th className="atom-list__header">Last Modified</th>
                                <th className="atom-list__header">Created by</th>
                                <th className="atom-list__header">Publication status</th>
                                <th className="atom-list__header"> </th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.atomList.map((atom) => (
                            <tr className="atom-list__row">
                                <td className="atom-list__item">
                                    <Link to={`/atoms/${atom.atomType}/${atom.id}/edit`} className="atom-list__link atom-list__editor-link" key={atom.id}>
                                        {atomTitleExtractor(atom)}
                                    </Link>
                                </td>
                                <td className="atom-list__item">{atom.atomType}</td>
                                <td className="atom-list__item">{atom.contentChangeDetails.lastModified ? new Date(atom.contentChangeDetails.lastModified.date).toDateString() : 'unknown'}</td>
                                <td className="atom-list__item">
                                    {this.getUserString(atom.contentChangeDetails.created)}
                                </td>
                                <td className="atom-list__item">publication status</td>
                                <td className="atom-list__item">
                                    <Link to={`/atoms/${atom.atomType}/${atom.id}/details`} className="atom-list__link atom-list__editor-link" key={atom.id}>
                                        Find Atom
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
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
        atomList: state.atomList
    };
}

function mapDispatchToProps(dispatch) {
    return {
        atomListActions: bindActionCreators(Object.assign({}, getAtomListActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AtomList);