import React, {PropTypes} from 'react';
import ShowErrors from '../Utilities/ShowErrors';
import { errorPropType } from '../../constants/errorPropType';
import moment from 'moment';

export default class FormFieldDateTextInput extends React.Component {


    static propTypes = {
        fieldLabel: PropTypes.string,
        fieldName: PropTypes.string,
        fieldValue: PropTypes.number,
        fieldErrors: PropTypes.arrayOf(errorPropType),
        formRowClass: PropTypes.string,
        onUpdateField: PropTypes.func
    };

    milisecondsToString = (ms) => {
        moment(ms).format("yyyy-MM-dd");
    }

    state = {
        fieldDisplayValue: this.milisecondsToString(this.props.fieldValue)
    };

    onUpdate = (e) => {
        let momentDate = moment(e.target.value, "YYYY-MM-DD", true);
        if (momentDate.isValid()) {
            this.setState ({
                fieldDisplayValue: e.target.value
            });
            this.props.onUpdateField(momentDate.valueOf());
        }
    }

    componentWillReceiveProps(newProps) {
        this.milisecondsToString(newProps.fieldValue);
    }


    render() {

        return (
            <div className={this.props.formRowClass || "form__row"}>
                {this.props.fieldLabel ? <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label> : false}
                <input
                    type="date"
                    className={"form__field " + (this.props.fieldErrors && this.props.fieldErrors.length ? "form__field--error" : "")}
                    id={this.props.fieldName}
                    onChange={this.onUpdate}
                    value={this.state.fieldDisplayValue || ""}
                />
                <ShowErrors errors={this.props.fieldErrors}/>
            </div>

        );
    }
}