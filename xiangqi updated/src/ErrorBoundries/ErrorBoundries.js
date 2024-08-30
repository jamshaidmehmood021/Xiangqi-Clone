import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

Modal.setAppElement('#root');

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }


  render() {
    if (this.state.hasError) {
      const componentStack = this.state.errorInfo?.componentStack || 'No additional information available.';

      return (
        <Modal
          isOpen={this.state.hasError}
          onRequestClose={this.handleCloseModal}
          contentLabel="Error"
          className="modal"
          overlayClassName="overlay"
        >
          <h2 className="text-xl font-bold">Something went wrong.</h2>
          <p className="mt-2">{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <p className="mt-2 font-semibold">Module/Component Info:</p>
          <pre className="bg-gray-100 p-2 rounded border border-gray-300">
            {componentStack}
          </pre>
        </Modal>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
