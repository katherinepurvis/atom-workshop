import React, {PropTypes} from 'react';
import { searchAtoms } from '../../../services/capi';
import SearchTextInput from './SearchTextInput';

const noop = () => {};

export default class SearchSuggestions extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    filters: PropTypes.object,
    onSelect: PropTypes.func
  };

  initialState = 'idle';
  
  machine = {
    idle: {
      KEY: 'type'
    },
    type: {
      KEY: 'type',
      TIMEOUT: 'search',
      ESC: 'idle'
    },
    search: {
      KEY: 'type',
      RESOLVE: 'results',
      REJECT: 'error'
    },
    results: {
      KEY: 'type',
      ESC: 'idle',
      SEL: 'idle'
    },
    error: {
      KEY: 'type'
    }
  };
  
  constructor(props) {
    super(props);
      
    this.state = {
      machineState: this.initialState,
      query: undefined,
      results: undefined,
      timer: undefined
    };
    
    this.commands = {
      idle: this.reset,
      type: this.isTyping,
      search: this.search,
      results: noop,
      error: this.displayError
    };
  }

  transition(action) {
    const { machineState } = this.state;
    const nextState = this.machine[machineState][action];
    const command = this.commands[nextState];
    this.setState({ machineState: nextState }, command);
  }

  onChange = (query) => {
    this.setState({ query });
    this.transition('KEY');
  }

  onKey = (key) => {
    if (key === 27) {
      this.transition('ESC');
    }
  }

  onClick = (i) => () => {
    this.props.onSelect(this.state.results[i]);
    this.transition('SEL');
  }

  reset = () => {
    if (this.state.timer) {
      clearTimeout(this.state.timer);
    }
    
    this.setState({
      query: undefined,
      results: undefined,
      timer: undefined
    });
  }

  isTyping = () => {
    if (this.state.timer) {
      clearTimeout(this.state.timer);
    }

    this.setState({
      results: undefined,
      error: undefined,
      timer: setTimeout(() => { this.transition('TIMEOUT'); },200)
    });
  }

  search = () => {
    if (!(this.state.query && this.state.query.length > 2)) {
      this.transition('ESC');
      return;
    }
    
    const query = Object.assign({}, this.props.filters, {
      q: this.state.query
    });

    searchAtoms(query)
      .then(results => {
        this.setState({ results });
        this.transition('RESOLVE');
      })
      .catch(error => {
        this.setState({ error });
        this.transition('REJECT');
      });
  }

  displayError = () => {

  }

  renderResults() {
    if (this.state.results) {
      const results = this.state.results.map((result, i) =>
        <li onClick={this.onClick(i)}>{result.title}</li>
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
        <SearchTextInput fieldValue={this.state.query} 
                         fieldPlaceholder={this.props.placeholder} 
                         onUpdateField={this.onChange} 
                         onKeyUp={this.onKey} 
                         />
        {this.renderResults()}
      </div>
    );
  }
}
