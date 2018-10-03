import React, { PropTypes } from 'react';
import Modal from '../../Utilities/Modal';
import {atomPropType} from '../../../constants/atomPropType';

export class ChartEditor extends React.Component {

  static propTypes = {
    atom: atomPropType.isRequired,
    config: PropTypes.shape({
      visualsUrl: PropTypes.string.isRequired
    }).isRequired
  }

  state = {
    modalOpen: false
  };

  toggleModal = (e) => {
    e.preventDefault();
    if (this.state.modalOpen) {
      this.closeModal();
    } else {
      this.openModal();
    }
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
    window.removeEventListener('message', this.onMessage, false);
  };

  openModal = () => {
    this.setState({ modalOpen: true });
    window.addEventListener('message', this.onMessage, false);
  };

  componentDidMount() {
    window.addEventListener("message", this.handleFrameTasks);
  }

  componentWillUnmount() {
    window.removeEventListener("message", this.handleFrameTasks);
  }

  handleFrameTasks = (e) => {
    if(e.origin === this.props.config.visualsUrl && e.data === "saving_atom"){
      this.toggleModal(e);
    }
  }

  render () {

    return (
      <div>
        <button className="btn" onClick={this.toggleModal}>
          Edit Chart
        </button>
        <Modal isOpen={this.state.modalOpen} dismiss={this.closeModal}>
          <iframe className="chartembedder__modal" src={`${this.props.config.visualsUrl}/basichartool?atom=${this.props.atom.id}`} />
        </Modal>
        <p>Soon to be beautifully rendered chart html.</p>
        {this.props.atom.defaultHtml}
      </div>
    );
  }
}