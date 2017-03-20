import React, {PropTypes} from 'react';
import {allAtomTypes} from '../../constants/atomData';
import {ManagedField} from '../ManagedEditor';
import FormFieldTextInput from '../FormFields/FormFieldTextInput';
import FormFieldCheckboxGroup from '../FormFields/FormFieldCheckboxGroup';
import FormFieldSelectBox from '../FormFields/FormFieldSelectBox';

class AtomListSearch extends React.Component {

  componentWillMount() {
    this.props.searchActions.updateSearch({
      types:[],
      "page-size": "20",
      q: "",
      searchFields: "data.title,data.label,title,labels,data.body"
    });
  }

  updateSearch = (search) => {
    this.props.searchActions.updateSearch(search);
  };


  render() {
    return (
      <div>
        <div className="atom-list-filters">
          <div className="atom-list-filters__search-box">
              <ManagedField data={this.props.search || {}} updateData={this.updateSearch} fieldLocation="q" name="Search:">
                  <FormFieldTextInput/>
              </ManagedField>
          </div>

          <div className="atom-list-filters__page-size">
              <ManagedField data={this.props.search || {}} updateData={this.updateSearch} fieldLocation="page-size" name="Page size:">
                  <FormFieldSelectBox selectValues={["20","50","100","150","200"]}/>
              </ManagedField>
          </div>
        </div>
      </div>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as updateSearchActions from '../../actions/SearchActions/updateSearch';

function mapStateToProps(state) {
    return {
        search: state.search
    };
}

function mapDispatchToProps(dispatch) {
    return {
        searchActions: bindActionCreators(Object.assign({}, updateSearchActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AtomListSearch);
