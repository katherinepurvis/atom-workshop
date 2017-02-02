import React from 'react';

import Header from './Header';
import ScribeEditor from './ScribeEditor/ScribeEditor';

export default class ReactApp extends React.Component {

  updateDescription = (newContent) => {
    console.log(newContent);
  };

  render() {
    return (
      <div className="page">
      <Header />
      <main className="container" role="main">

      <section className="page__section">

      <h2 className="page__subheading">Atom Workshop</h2>

      <ScribeEditor
        onUpdate={this.updateDescription}
        value=""
        className="scribe"
        toolbarClassName="scribe__toolbar"
        toolbarItemClassName="scribe__toolbar__item"
        editorClassName="scribe__editor"
      />


      </section>

      </main>
      </div>
    );
  }
}
