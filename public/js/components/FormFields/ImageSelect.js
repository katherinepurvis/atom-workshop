import React, { PropTypes } from 'react'
import Modal from '../Utilities/Modal';

const assetPropType = PropTypes.shape({
  mimeType: PropTypes.string.isRequired,
  file: PropTypes.string.isRequired,
  dimensions: PropType.shape({
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired
  }).isRequired,
  size: PropTypes.number.isRequired
});

const gridImagePropType = PropTypes.shape({
  mediaId: PropTypes.string.isRequired,
  assets: PropTypes.arrayOf(assetPropType).isRequired,
  master: assetPropType.isRequired
});

class ImageSelect extends React.Component {

  static propTypes = {
    updateField: PropTypes.func.isRequired,
    value: gridImagePropType
  }

  defaultState = {
    isOpen: false
  }

  render () {
    return (
      <Modal isOpen={this.state.isOpen}>
        <div>Test Modal</div>
      </Modal>
    )
  }
}

export default ImageSelect;
