import React, { Component, PropTypes } from 'react';
import {atomPropType} from '../../constants/atomPropType';

class NotificationList extends Component {

  static propTypes = {
    actions: PropTypes.shape({
      createNotificationList: PropTypes.func.isRequired,
      deleteNotificationList: PropTypes.func.isRequired,
      sendNotificationList: PropTypes.func.isRequired,
      hasNotificationBeenSent: PropTypes.func.isRequired
    }).isRequired,
    atom: atomPropType
  }

  constructor(props) {
    super(props);
    this.state = { notificationSent: false };
  }

  componentDidMount() {
    if (this.props.atom.data.storyquestions.editorialQuestions) {
      const qs = this.props.atom.data.storyquestions.editorialQuestions
        .filter(qs => qs.questions.some(q => q.answers.length > 0))
        .map(qs => qs.questions.find(q => q.answers.length > 0));
      if (qs.length) {
        this.props.actions.hasNotificationBeenSent(this.props.atom.atomId, qs[0].questionId)
          .then(sent => this.setState({ notificationSent: !!sent }));
      }
    }
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

    const notificationState = listData ?
      (this.state.sent ? 'END' : 'CREATED') :
      'START';

    return (
      <div className="atom__actions">
        <div className="form">
          <div className="form__row">
            <h3 className="form__subheading">Email notification list</h3>
            {notificationState === 'START' ? (
              <button className="btn" onClick={this.createNotificationList.bind(this)}>
                Create List
              </button>
            ) : notificationState === 'CREATED' ? (
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
            ) : notificationState === 'END' ? (
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
            ) : ("")}
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
import * as hasNotificationBeenSent from '../../actions/AtomActions/hasNotificationBeenSent.js';

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
      sendNotificationList,
      hasNotificationBeenSent
    ), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationList);
