import React from 'react';
import {atomPropType} from '../../constants/atomPropType.js';

class EmbeddedAtomPick extends React.Component {

  static propTypes = {
    atom: atomPropType.isRequired
  }

  triggerEmbedMessage = () => {
    window.parent.postMessage({
      atomId: this.props.atom.id,
      atomType: this.props.atom.atomType
    }, '*');
  }

  render () {
    return (
      <button className="btn" onClick={this.triggerEmbedMessage()}>
        Pick this atom
      </button>
    );
  }
}

export default EmbeddedAtomPick;
