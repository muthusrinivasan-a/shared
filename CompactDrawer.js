import React, { useState } from "react";
import PropTypes from "prop-types";
import "./CompactDrawer.css";

const CompactDrawer = ({ children, isOpen, onClose, defaultMinimized, title }) => {
  const [isMinimized, setIsMinimized] = useState(defaultMinimized);

  const handleMinimizeToggle = () => {
    setIsMinimized((prev) => !prev);
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div
      className={`compact-drawer ${isOpen ? "open" : ""} ${
        isMinimized ? "minimized" : ""
      }`}
      role="dialog"
      aria-hidden={!isOpen}
    >
      <div className="drawer-header">
        <span className="drawer-title">{title}</span>
        <div className="drawer-actions">
          <button
            onClick={handleMinimizeToggle}
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            _
          </button>
          <button onClick={handleClose} aria-label="Close">
            X
          </button>
        </div>
      </div>
      {!isMinimized && <div className="drawer-body">{children}</div>}
    </div>
  );
};

CompactDrawer.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  defaultMinimized: PropTypes.bool,
  title: PropTypes.string,
};

CompactDrawer.defaultProps = {
  onClose: null,
  defaultMinimized: false,
  title: "Title",
};

export default CompactDrawer;
