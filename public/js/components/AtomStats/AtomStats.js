import React, {PropTypes} from 'react';
import {atomPropType} from '../../constants/atomPropType';

class AtomStats extends React.Component {
  static propTypes = {
    routeParams: PropTypes.shape({
      atomType: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    }).isRequired,
    atomActions: PropTypes.shape({
      getAtom: PropTypes.func.isRequired
    }).isRequired,
    atom: atomPropType
  }

  render() {
    return (
      <p>STATS</p>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as getAtomActions from '../../actions/AtomActions/getAtom.js';

function mapStateToProps(state) {
  return {
    atom: state.atom
  };
}

export default connect(mapStateToProps)(AtomStats);
