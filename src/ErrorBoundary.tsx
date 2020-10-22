import React from 'react';

type Props = any;
type State = {
  error: Error | null;
};
class ErrorBoundary extends React.Component<Props, State> {
  state = {
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return {
      error,
    };
  }

  render() {
    const { error } = this.state;

    if (error) {
      return (
        <div>
          <p>Something went wrong</p>
          <button onClick={() => this.setState({ error: null })}>
            retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
