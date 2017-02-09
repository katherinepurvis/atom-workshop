import React from 'react';
import Header from './Header/Header';

export class Page extends React.Component {

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
