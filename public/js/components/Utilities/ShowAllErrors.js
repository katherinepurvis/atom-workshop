import React, { PropTypes } from 'react';
import flattenFormErrors from '../../util/flattenFormErrors';

class ShowAllErrors extends React.Component {
  static propTypes = {
    formErrors: PropTypes.array,
  };

  render() {
    const { formErrors } = this.props;
    return (
      <section className="list">
        {formErrors.map(({ title, message }) => (
          <div className="list__item list__item--error">
            <div className="list__item__title">Error: {title}</div>
            <p className="list__item__body">{message}</p>
          </div>
        ))}
      </section>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    formErrors: flattenFormErrors(state.formErrors),
  };
}

export default connect(mapStateToProps)(ShowAllErrors);
