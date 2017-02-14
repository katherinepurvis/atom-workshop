import React, {PropTypes} from 'react';
import Header from './Header/Header';

export class Page extends React.Component {

  static propTypes = {
    children: PropTypes.element.isRequired
  }

  render() {
    return (
      <div className="page">
        <Header />
        <div className="page__content">
          {this.props.children}
        </div>
      </div>
    );
  }
}
