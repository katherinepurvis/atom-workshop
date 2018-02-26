import React, { Component, PropTypes } from 'react';
import {atomPropType} from '../../constants/atomPropType';
import {
  notificationStateType
} from '../../constants/notificationStateType';

class NotificationList extends Component {

  static propTypes = {
    actions: PropTypes.shape({
      createNotificationList: PropTypes.func.isRequired,
      deleteNotificationList: PropTypes.func.isRequired,
      sendNotificationList: PropTypes.func.isRequired
    }).isRequired,
    atom: atomPropType,
    notificationState: notificationStateType
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

    return (
      <div className="atom__actions">
        <div className="form">
          <div className="form__row">
            <h3 className="form__subheading">Email notification list</h3>
            {this.props.notificationState === 'START' ? (
              <button className="btn" onClick={this.createNotificationList.bind(this)}>
                Create List
              </button>
            ) : this.props.notificationState === 'CREATED' ? (
              <div>
                <div className="listId">
                  <b>{listData.email.name} list ID: </b>
                  {listData.email.listId}
                </div>
                <p>
                  Send your answer directly to all the readers who wanted to see it:
                  <button className="btn" onClick={this.sendNotificationList.bind(this)}>
                    Send
                  </button>
                </p>
              </div>
            ) : this.props.notificationState === 'END' (
              <div>
                <div className="listId">
                  <b>{listData.email.name} list ID: </b>
                  {listData.email.listId}
                </div>
                <p>
                  <button className="btn btn--red" onClick={this.deleteNotificationList.bind(this)}>
                    Delete List
                  </button>
                  <small>
                    It may take a few minutes for the email to be sent out, so it is worth
                    not pushing that button <em>right after</em> having hit "Send".
                  </small>
                </p>
              </div>
            )}
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
