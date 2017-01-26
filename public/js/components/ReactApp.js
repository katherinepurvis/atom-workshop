import React from 'react';

import Header from './Header';
import TextInput from './FormFields/FormFieldTextInput';
import SelectBox from './FormFields/FormFieldSelectBox';

export default class ReactApp extends React.Component {


  render() {
    return (
      <div className="page">
          <Header />
          <main className="container" role="main">

            <section className="page__section">

              <h2 className="page__subheading">Atom Workshop</h2>

              <div className="form__row">
                <FormFieldTextInput fieldName="test field" fieldLabel="test label" fieldPlaceholder="placeholder" fieldValue=""/>
              </div>
              <div className="form__row">
                <FormFieldSelectBox fieldName="test field" fieldLabel="test label" selectValues={[1, 2, 3, 4, 5]} />
              </div>

            </section>

          </main>
      </div>
    );
  }
}
