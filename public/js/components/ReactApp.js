import React from 'react';

import Header from './Header';
import ScribeEditor from './ScribeEditor/ScribeEditor';

export default class ReactApp extends React.Component {

  updateDescription = () => {
    console.log("Updated");
  };

  render() {
    return (
      <div className="page">
      <Header />
      <main className="container" role="main">

      <section className="page__section">

      <h2 className="page__subheading">Atom Workshop</h2>

      <ScribeEditor
        onChange={this.updateDescription}
        value=""
        className="tag-edit__richtext"
        toolbarClassName="scribe-toolbar"
        toolbarItemClassName="scribe-toolbar-item"
        editorClassName="scribe-editor"
      />


      </section>

      </main>
      </div>
    );
  }
}
