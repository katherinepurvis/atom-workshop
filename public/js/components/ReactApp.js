import React from 'react';

import Header from './Header';
import FormFieldTextInput from './FormFields/FormFieldTextInput';
import FormFieldSelectBox from './FormFields/FormFieldSelectBox';
import FormFieldRadioButtons from './FormFields/FormFieldRadioButtons';
import FormFieldImageSelect from './FormFields/FormFieldImageSelect';
import ScribeEditor from './ScribeEditor/ScribeEditor';


const testImage = {
  "assets":[
    {
      "file":"https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/5dfc898f6866c8bb4224b65b9aae89e6eb7af30f/783_0_2025_1215/2000.jpg",
      "mimeType":"image/jpeg",
      "size":119846,
      "dimensions":{"width":2000,"height":1200}
    },
    {
      "file":"https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/5dfc898f6866c8bb4224b65b9aae89e6eb7af30f/783_0_2025_1215/1000.jpg",
      "mimeType":"image/jpeg",
      "size":35608,
      "dimensions":{"width":1000,"height":600}
    },
    {
      "file":"https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/5dfc898f6866c8bb4224b65b9aae89e6eb7af30f/783_0_2025_1215/500.jpg",
      "mimeType":"image/jpeg",
      "size":14222,
      "dimensions":{"width":500,"height":300}
    },
    {
      "file":"https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/5dfc898f6866c8bb4224b65b9aae89e6eb7af30f/783_0_2025_1215/140.jpg",
      "mimeType":"image/jpeg",
      "size":5412,
      "dimensions":{"width":140,"height":84}
    },
    {
      "file":"https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/5dfc898f6866c8bb4224b65b9aae89e6eb7af30f/783_0_2025_1215/2025.jpg",
      "mimeType":"image/jpeg",
      "size":140729,
      "dimensions":{"width":2025,"height":1215}
    }
  ],
  "master":{
    "file":"https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/5dfc898f6866c8bb4224b65b9aae89e6eb7af30f/783_0_2025_1215/master/2025.jpg",
    "mimeType":"image/jpeg",
    "size":980347,
    "dimensions":{"width":2025,"height":1215}
  },
  "mediaId":"https://api.media.test.dev-gutools.co.uk/images/5dfc898f6866c8bb4224b65b9aae89e6eb7af30f"
}

export default class ReactApp extends React.Component {

  updateAck = (e) => {
    console.log("Updated", e);
  };

  render() {
    return (
      <div className="page">
        <Header />
        <main className="container" role="main">

          <section className="page__section">

            <h2 className="page__subheading">Atom Workshop</h2>

            <ScribeEditor
              onChange={this.updateAck}
              value=""
              className="scribe"
              toolbarClassName="scribe__toolbar"
              toolbarItemClassName="scribe__toolbar__item"
              editorClassName="scribe__editor"
              />

            <div className="form__row">
              <FormFieldRadioButtons fieldName="test field" fieldLabel="test label" fieldValues={["1", "2", "3", "4", "5"]} checkedValue="1" onUpdateField={this.updateAck}/>
            </div>

            <div className="form__row">
              <FormFieldImageSelect fieldName="test field" fieldLabel="test label" onUpdateField={this.updateAck} gridUrl="https://media.test.dev-gutools.co.uk" />
            </div>

            <div className="form__row">
              <FormFieldImageSelect fieldName="test field" fieldLabel="test label" fieldValue={testImage} onUpdateField={this.updateAck} gridUrl="https://media.test.dev-gutools.co.uk" />
            </div>
          </section>
        </main>
      </div>
    );
  }
}
