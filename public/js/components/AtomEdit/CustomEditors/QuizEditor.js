import React, { PropTypes } from 'react';

export class QuizEditor extends React.Component {
    static propTypes = {
        atom: PropTypes.shape({
          type: PropTypes.string,
          id: PropTypes.string
        }).isRequired,
        onUpdate: PropTypes.func.isRequired,
        onFormErrorsUpdate: PropTypes.func,
        config: PropTypes.shape({
          gridUrl: PropTypes.string.isRequired
        }).isRequired
      }

    render() {
        return <h3>{this.props.atom.data.quiz.title}</h3>;
    }
}