import React from 'react';

import Header from './Header';

export default class ReactApp extends React.Component {

  updateDescription = (newContent) => {
    console.log(newContent);
  };

  render() {

    const data = [
      {id: 'one', selected: false},
      {id: 'two', selected: true}
    ];

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
