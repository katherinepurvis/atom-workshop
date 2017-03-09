import React, { PropTypes } from 'react';
import {CTAEditor} from './CustomEditors/CTAEditor';
import {RecipeEditor} from './CustomEditors/RecipeEditor';
import {ExplainerEditor} from './CustomEditors/ExplainerEditor';
import {StoryQuestionsEditor} from './CustomEditors/StoryQuestionsEditor';
import EmbeddedAtomPick from './EmbeddedAtomPick';

import AtomEditHeader from './AtomEditHeader';

import {atomPropType} from '../../constants/atomPropType.js';

class AtomEdit extends React.Component {

  static propTypes = {
    atomActions: PropTypes.shape({
      updateAtom: PropTypes.func.isRequired
    }).isRequired,
    atom: atomPropType,
    config: PropTypes.shape({
      gridUrl: PropTypes.string,
      embeddedMode: PropTypes.string,
      isEmbedded: PropTypes.bool.isRequired
    })
  }

  updateAtom = (newAtom) => {
    this.props.atomActions.updateAtom(newAtom);
  }

  renderSpecificEditor () {

    //TODO: This is brittle, can we improve?
    const atomType = this.props.atom.atomType.toLowerCase();

    switch (atomType) {
      case ("cta"):
        return <CTAEditor atom={this.props.atom} onUpdate={this.updateAtom}/>;
      case ("recipe"):
        return <RecipeEditor atom={this.props.atom} onUpdate={this.updateAtom} config={this.props.config}/>;
      case ("explainer"):
        return <ExplainerEditor atom={this.props.atom} onUpdate={this.updateAtom}/>;
      case ("storyquestions"):
        return <StoryQuestionsEditor atom={this.props.atom} onUpdate={this.updateAtom}/>;
      default:
        return (
          <div>Atom Workshop cannot edit this type of atom currently</div>
        );
    }
  }

  renderEmbeddedCreate() {
    if (!this.props.config.isEmbedded || this.props.config.embeddedMode !== "browse") {
      return false;
    }

    return <EmbeddedAtomPick atom={this.props.atom}/>;
  }

  render() {
    if (!this.props.atom) {
      return <div>Loading...</div>;
    }

    return (
        <div className="atom-editor">
          {this.renderEmbeddedCreate()}
          <AtomEditHeader atom={this.props.atom} onUpdate={this.updateAtom}/>
          <div className="atom-editor__form">
            {this.renderSpecificEditor()}
          </div>
        </div>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as getAtomActions from '../../actions/AtomActions/getAtom.js';
import * as updateAtomActions from '../../actions/AtomActions/updateAtom.js';

function mapStateToProps(state) {
  return {
    config: state.config,
    atom: state.atom
  };
}

function mapDispatchToProps(dispatch) {
  return {
    atomActions: bindActionCreators(Object.assign({}, updateAtomActions, getAtomActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AtomEdit);
