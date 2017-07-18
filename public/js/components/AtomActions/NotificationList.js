import React, { Component, PropTypes } from 'react';
import {atomPropType} from '../../constants/atomPropType';

class NotificationList extends Component {

  static propTypes = {
    actions: PropTypes.shape({
      createNotificationList: PropTypes.func.isRequired,
      deleteNotificationList: PropTypes.func.isRequired
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

  render() {
    const listData = this.getListData(this.props.atom);

    return (
      <div className="atom__actions">
        <div className="form">
          <div className="form__row">
            <h3 className="form__subheading">Email notification list</h3>
            { listData ? (
              <div>
                <div className="listId">
                  <b>{listData.email.name} list ID: </b>
                  {listData.email.listId}
                </div>
                <button className="btn btn--red" onClick={this.deleteNotificationList.bind(this)}>
                  Delete List
                </button>
              </div>
            ) : (
              <button className="btn" onClick={this.createNotificationList.bind(this)}>
                Create List
              </button>
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

function mapStateToProps(state) {
  return {
    atom: state.atom
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, createNotificationList, deleteNotificationList), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationList);
