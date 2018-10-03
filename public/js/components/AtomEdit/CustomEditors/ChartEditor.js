import React, { PropTypes } from 'react';
import Modal from '../../Utilities/Modal';

export class ChartEditor extends React.Component {

  static propTypes = {
    atomId: PropTypes.string,
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

  render () {

    return (
      <div>
        <button className="btn" onClick={this.toggleModal}>
          Edit Chart
        </button>
        <Modal isOpen={this.state.modalOpen} dismiss={this.closeModal}>
          <iframe className="chartembedder__modal" src={`${this.props.config.visualsUrl}/basichartool?atom=${this.props.atomId}`} />
        </Modal>
      </div>
    );
  }
}