import React, {PropTypes} from 'react';
import { createStore } from 'redux';
import { searchAtoms } from '../../../services/capi';
import SearchTextInput from './SearchTextInput';

const noop = () => {};

const KEY = 'KEY';
const ESC = 'ESC';
const SEL = 'SEL';
const TIMEOUT = 'TIMEOUT';
const RESOLVE = 'RESOLVE';
const REJECT = 'REJECT';

const key = () => ({ type: KEY });
const esc = () => ({ type: ESC });
const sel = () => ({ type: SEL });
const timeout = () => ({ type: TIMEOUT });
const resolve = () => ({ type: RESOLVE });
const reject = () => ({ type: REJECT });

export default class SearchSuggestions extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    filters: PropTypes.object,
    onSelect: PropTypes.func
  };

  initialState = 'idle';

  store = createStore(this.transition, this.initialState);
  
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
  
  state = {
    query: undefined,
    results: undefined,
    timer: undefined
  };
  
  commands = {
    idle: this.reset,
    type: this.isTyping,
    search: this.search,
    results: noop,
    error: this.displayError
  };

  transition(machineState, action) {
    const nextState = this.machine[machineState][action.type];
    if (this.commands[nextState]) {
      this.commands[nextState]();
    }
    return nextState;
  }

  onChange = (query) => {
    this.setState({ query });
    this.store.dispatch(key());
  }

  onKey = (key) => {
    if (key === 27) {
      this.store.dispatch(esc());
    }
  }

  onClick = (i) => () => {
    this.props.onSelect(this.state.results[i]);
    this.store.dispatch(sel());
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
      timer: setTimeout(() => { this.store.dispatch(timeout()); },200)
    });
  }

  search = () => {
    if (!(this.state.query && this.state.query.length > 2)) {
      this.store.dispatch(esc());
      return;
    }
    
    const query = Object.assign({}, this.props.filters, {
      q: this.state.query
    });

    searchAtoms(query)
      .then(results => {
        this.setState({ results });
        this.store.dispatch(resolve());
      })
      .catch(error => {
        this.setState({ error });
        this.store.dispatch(reject());
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
