import React, { PropTypes } from 'react';

import {CTAEditor} from './CustomEditors/CTAEditor';

export default class AtomEdit extends React.Component {

  static propTypes = {
    atom: PropTypes.shape({
      type: PropTypes.string
    })
  }

  static defaultProps = {
    atom: {
      id: "123",
      atomType: "CTA",
      data: {
        url: "Test url"
      }
    }
  }

  updateAtom(atom) {
    console.log("New Atom", atom, "Old Atom", atom)
  }

  render () {
    const atomType = this.props.atom.atomType.toLowerCase();

    switch (atomType) {
      case ("cta"):
        return <CTAEditor atom={this.props.atom} onUpdate={this.updateAtom}/>;
      default:
        return (
          <div>Unrecognised Atom Type, please add an editor</div>
        );
    }
  }
}
