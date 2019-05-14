import React, { PropTypes } from 'react';

const HoverExpander = ({ children, proxy }) => (
  <div className="hover-expander">
    <div className="hover-expander__trigger">{proxy}</div>
    <div className="hover-expander__content">{children}</div>
  </div>
);

HoverExpander.propTypes = {
  children: PropTypes.node.isRequired,
  proxy: PropTypes.node.isRequired,
};

export default HoverExpander;
