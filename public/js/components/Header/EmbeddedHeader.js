import React, { PropTypes } from 'react';
import {Link} from 'react-router';

class EmbeddedHeader extends React.Component {

  static propTypes = {
    config: PropTypes.shape({
      isEmbedded: PropTypes.bool.isRequired
    }),
    isFindPage: PropTypes.bool.isRequired
  }


  renderEmbeddedCreate() {
    return (
      <Link to="/create" className="toolbar__button">Create New Atom</Link>
    );
  }

  renderEmbeddedBackButton() {
    return (
      <Link to="/find" className="toolbar__button">Back to Atom Search</Link>
    );
  }
  render () {
    return (
      <div className="toolbar--embedded">
        {this.props.isFindPage ? this.renderEmbeddedCreate() : this.renderEmbeddedBackButton()}
      </div>
    );
  }
}

export default EmbeddedHeader;
