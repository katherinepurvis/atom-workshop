import React from 'react';
import Header from './Header';

export default class ReactApp extends React.Component {


  render() {

    return (
      <div className="page">
      <Header />
      <main className="container" role="main">

      <section className="page__section">

      <h2 className="page__subheading">Atom Workshop</h2>

      </section>

      </main>
      </div>
    );
  }
}
