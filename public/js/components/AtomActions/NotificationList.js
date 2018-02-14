import React, { Component, PropTypes } from 'react';
import {atomPropType} from '../../constants/atomPropType';

let CREATE = 'create';
let SEND = 'send';
let SENT = 'sent';

class NotificationList extends Component {

  static propTypes = {
    actions: PropTypes.shape({
      createNotificationList: PropTypes.func.isRequired,
      deleteNotificationList: PropTypes.func.isRequired,
      sendNotificationList: PropTypes.func.isRequired
    }).isRequired,
    atom: atomPropType
  }

  constructor(props) {
    super(props);
  }

  getListData(atom) {
    return (atom.data && atom.data.storyquestions && atom.data.storyquestions.notifications);
  }

  createNotificationList() {
    this.props.actions.createNotificationList(this.props.atom);
  }

  deleteNotificationList() {
    this.props.actions.deleteNotificationList(this.props.atom);
  }

  sendNotificationList() {
    this.props.actions.sendNotificationList(this.props.atom);
  }

  render() {
    const listData = this.getListData(this.props.atom);
    const state = CREATE;

    return (
      <div className="atom__actions">
        <div className="form">
          <div className="form__row">
            <h3 className="form__subheading">Email notification list</h3>
            {state === CREATE ? (
              <button className="btn" onClick={this.createNotificationList.bind(this)}>
                Create List
              </button>
            ) : state === SEND ? (
              <div>
                <div className="listId">
                  <b>{listData.email.name} list ID: </b>
                  {listData.email.listId}
                </div>
                <button className="btn btn--red" onClick={this.deleteNotificationList.bind(this)}>
                  Delete List
                </button>
                <div>
                  <p>
                    Send answer directly to all the readers that asked the question:
                    <button className="btn" onClick={this.sendNotificationList.bind(this)}>
                      Send
                    </button>
                  </p>
                </div>
              </div>
            ) : ("")
            }
          </div>
        </div>
      </div>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as createNotificationList from '../../actions/AtomActions/createNotificationList.js';
import * as deleteNotificationList from '../../actions/AtomActions/deleteNotificationList.js';
import * as sendNotificationList from '../../actions/AtomActions/sendNotificationList.js';

function mapStateToProps(state) {
  return {
    atom: state.atom
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, 
      createNotificationList, 
      deleteNotificationList, 
      sendNotificationList
    ), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationList);
