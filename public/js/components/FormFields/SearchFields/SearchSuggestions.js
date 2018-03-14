import React, {PropTypes} from 'react';
import SearchTextInput from './SearchTextInput';

class SearchSuggestions extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    filters: PropTypes.object,
    onSelect: PropTypes.func.isRequired,
    results: PropTypes.array,
    query: PropTypes.object,
    queryStr: PropTypes.string,
    searchActions: PropTypes.shape({
      update: PropTypes.func.isRequired,
      cancel: PropTypes.func.isRequired,
      search: PropTypes.func.isRequired
    }).isRequired
  };

  state = {
    timer: undefined
  };
  
  onChange = (query) => {
    this.props.searchActions.update(query);
    this.isTyping();
  }

  onKey = (key) => {
    if (key === 27) {
      this.reset();
    }
  }

  onClick = (i) => () => {
    this.props.searchActions.cancel();
    this.props.onSelect(this.props.results[i]);
  }

  reset = () => {
    if (this.state.timer) {
      clearTimeout(this.state.timer);
      this.setState({ timer: undefined });
    }
    
    this.props.searchActions.cancel();
  }

  isTyping = () => {
    if (this.state.timer) {
      clearTimeout(this.state.timer);
    }

    this.setState({
      timer: setTimeout(this.search, 300)
    });
  }

  search = () => {
    if (!this.props.queryStr.length > 2) return;

    const query = Object.assign({}, this.props.filters, {
      q: this.props.queryStr
    });

    this.props.searchActions.search(query);
  }

  renderResults() {
    if (this.props.results) {
      const results = this.props.results.map((result, i) =>
        <li onClick={this.onClick(i)} key={result.title}>{result.title}</li>
      );
      return (
        <ul>
          {results}
        </ul>
      );
    }
  }

  render() {
    return (
      <div className="search-suggestions">
        <SearchTextInput fieldValue={this.props.queryStr} 
                         fieldPlaceholder={this.props.placeholder} 
                         onUpdateField={this.onChange} 
                         onKeyUp={this.onKey} 
                         />
        {this.renderResults()}
      </div>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cancel from '../../../actions/SearchSuggestionsActions/cancel.js';
import * as search from '../../../actions/SearchSuggestionsActions/search.js';
import * as update from '../../../actions/SearchSuggestionsActions/update.js';

function mapStateToProps(state) {
  return {
    queryStr: state.searchSuggestions.queryStr,
    results: state.searchSuggestions.results,
    query: state.searchSuggestions.query
  };
}

function mapDispatchToProps(dispatch) {
  return {
    searchActions: bindActionCreators(Object.assign({}, cancel, search, update), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchSuggestions);
