import React, { PropTypes } from 'react';

class ShowAllErrors extends React.Component {
  static propTypes = {
    formErrors: PropTypes.array,
  };

  render() {
    const { formErrors } = this.props;
    return (
      <section className="list">
        {formErrors.map(([_, fields]) =>
          fields.map(([field, errors]) =>
            errors.map(({ title, message }) => (
              <div className="list__item list__item--error">
                <div className="list__item__title">Error: {field}</div>
                <p className="list__item__body">{message}</p>
              </div>
            ))
          )
        )}
      </section>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    formErrors: Object.entries(state.formErrors).map(([key, values]) => [
      key,
      Object.entries(values),
    ]),
  };
}

export default connect(mapStateToProps)(ShowAllErrors);
