import React, { PropTypes } from 'react';

class ShowAllErrors extends React.Component {
	static propTypes = {
		formErrors: PropTypes.array,
	};

	render() {
		const { formErrors } = this.props;
		return (
			<div>
				{formErrors.map(([component, fields]) =>
					fields.map(([field, errors]) =>
						errors.map(({ title, message }) => (
							<div>
								{field} {title} err {message}
							</div>
						))
					)
				)}
			</div>
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
