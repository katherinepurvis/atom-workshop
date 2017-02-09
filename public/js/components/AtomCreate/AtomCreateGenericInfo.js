import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {getAtomByType} from '../../constants/atomData';
import {AtomTypeCard} from '../AtomTypeCard/AtomTypeCard.js';
import FormFieldTextInput from '../FormFields/FormFieldTextInput';

export class AtomCreateGenericInfo extends React.Component {

  static propTypes = {
    routeParams: PropTypes.shape({
      atomType: PropTypes.String
    }).isRequired
  }

  state = {
    title: ""
  }

  updateTitle = (e) => {
    this.setState({
      title: e.target.value
    });
  }

  createAtom = (e) => {
    console.log("This is where we create the atom");
  }

  render () {

    const atomType = getAtomByType(this.props.routeParams.atomType)

    if (!atomType) {
      return <div>Unrecognised Atom Type</div>
    }

    return (
      <div className="create">
        <h2>Create</h2>
        <div>
          <AtomTypeCard atomType={atomType} />
        </div>
        <Link to="/create">Select different atom</Link>
        <div className="create__form">
          <FormFieldTextInput
            fieldLabel="Title"
            fieldName="title"
            fieldValue={this.state.title}
            fieldPlaceholder="Enter a title for this atom"
            onUpdateField={this.updateTitle}
          />
        </div>
        <div className="create__buttons">
          <button className="btn" onClick={this.createAtom}>Create Atom</button>
        </div>
      </div>
    )
  }
}
