import React, {PropTypes} from 'react';
import {atomPropType} from '../../constants/atomPropType';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

class AtomStats extends React.Component {
  static propTypes = {
    routeParams: PropTypes.shape({
      atomType: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    }).isRequired,
    atomActions: PropTypes.shape({
      getAtomUsages: PropTypes.func.isRequired,
    }).isRequired,
    atom: atomPropType,
    atomUsages: PropTypes.array
  }

  componentWillMount() {
    this.props.atomActions.getAtomUsages(this.props.routeParams.atomType, this.props.routeParams.id);
  }


  renderAtomDetail = (name, value) => {
    return (
      <li key={name} className="details-list__item">
        <span className="details-list__title">{name}:</span> {value}
      </li>
    );
  }

  renderAtomDetails = () => {
    if(this.props.atom) {
      const atomType = this.props.routeParams.atomType.toLowerCase();
      return (
        <ul className="details-list">
          {
            Object.keys(this.props.atom.data[atomType])
            .map(key => this.renderAtomDetail(key, this.props.atom.data[atomType][key]))
          }
        </ul>
      );
    }
  }

  renderAtomUsage = (usage, i) => {

    return (
      <li className="usages-list__item" key={`usage-${i}`}>
        <a className="usages-list__item__link" href={usage.webUrl}>{usage.fields.headline}</a>
        <p className="usages-list__item__date">Created: {distanceInWordsToNow(usage.fields.creationDate, {addSuffix: true})}</p>
      </li>
    );
  }

  renderAtomUsages = () => {
    if(this.props.atomUsages) {
      return (
        <ul className="usages-list">
          {this.props.atomUsages.map((usage, i) => this.renderAtomUsage(usage, i))}
        </ul>
      );
    }
  }

  render() {
    return (
      <div className="atom-editor">
        <h1 className="atom-editor__title">{this.props.atom ? this.props.atom.title : ''}</h1>
        <div className="atom-editor__section">
          {this.renderAtomDetails()}
        </div>
        <h2>Usages</h2>
        <div className="atom-editor__section">
          {this.renderAtomUsages()}
        </div>
      </div>
    );
  }
}


//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as getAtomUsagesActions from '../../actions/AtomActions/getAtomUsages.js';

function mapStateToProps(state) {
  return {
    atom: state.atom,
    atomUsages: state.atomUsages,
    config: state.config
  };
}

function mapDispatchToProps(dispatch) {
  return {
    atomActions: bindActionCreators(Object.assign({}, getAtomUsagesActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AtomStats);
