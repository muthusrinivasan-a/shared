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




import React, { useState } from "react";
import CompactDrawer from "./components/CompactDrawer/CompactDrawer";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCompactDrawer = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      <h1>Compact Drawer Demo</h1>
      <p>
        Click <a href="#" onClick={(e) => { e.preventDefault(); toggleCompactDrawer(); }}>here</a> to open the drawer.
      </p>
      <CompactDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultMinimized={false}
        title="Compose Email"
      >
        <form>
          <div>
            <label htmlFor="to">To:</label>
            <input id="to" type="email" placeholder="Recipient's email" />
          </div>
          <div>
            <label htmlFor="subject">Subject:</label>
            <input id="subject" type="text" placeholder="Email subject" />
          </div>
          <div>
            <label htmlFor="message">Message:</label>
            <textarea id="message" placeholder="Write your message"></textarea>
          </div>
          <button type="submit">Send</button>
        </form>
      </CompactDrawer>
    </div>
  );
};

export default App;


.compact-drawer {
  position: fixed;
  bottom: 0;
  right: 20px;
  width: 400px;
  max-height: 80%;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;
  z-index: 1000;
}

.compact-drawer.open {
  transform: translateY(0);
}

.compact-drawer.minimized {
  bottom: 0;
  right: 20px;
  height: 40px;
  width: 200px;
  background: lightgray;
  border: 1px solid #999;
  transition: all 0.3s ease-in-out;
}

.drawer-header {
  background: #f4f4f4;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
}

.drawer-title {
  font-weight: bold;
}

.drawer-actions button {
  margin-left: 5px;
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

.drawer-actions button:hover {
  color: red;
}

.drawer-body {
  padding: 15px;
  overflow-y: auto;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
